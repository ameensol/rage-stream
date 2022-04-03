import { BigNumber } from "@ethersproject/bignumber";
import { MaxUint256 } from "@ethersproject/constants";
import { expect } from "chai";
import dayjs from "dayjs";

import { STREAM_DEPOSIT, TIME_DELTA, TIME_OFFSET } from "../../shared/constants";
import { blockTime, moveToBlockTime, snapshot, revert } from "../../shared/util";

export function shouldBehaveLikeRageStream(): void {
  const now: BigNumber = BigNumber.from(dayjs().unix());
  const startTime: BigNumber = now.add(TIME_OFFSET);
  const stopTime: BigNumber = startTime.add(TIME_DELTA);
  const tokensToBurn: BigNumber = BigNumber.from(500000); // 50% of 1M share tokens
  const totalStreamPieTokens: BigNumber = BigNumber.from(1000000); // 1M share tokens

  beforeEach(async function () {
    await this.contracts.token.connect(this.signers.sender).approve(this.contracts.streamPie.address, MaxUint256);
    await this.contracts.streamPie
    .connect(this.signers.sender)
    .createStreamPie(
      this.signers.recipient.address,
      STREAM_DEPOSIT,
      this.contracts.token.address,
      startTime,
      stopTime,
    );

    this.streamId = await this.contracts.streamPie.streamPieId()
  });

  context("with the streampie created but not started", function () {
    it('creates a new sablier stream', async function() {
      const streamId = this.streamId

      // use deployer as recipient for ragestream (deployer has 100% of initial streamPie tokens)
      await this.contracts.streamPie.connect(this.signers.deployer).approve(this.contracts.streamPie.address, tokensToBurn)
      await this.contracts.streamPie.connect(this.signers.deployer).rageStream(this.signers.deployer.address, tokensToBurn)

      const forkStreamId = await this.contracts.streamPie.forks(0)
      const newStreamId = await this.contracts.streamPie.streamPieId()

      expect(forkStreamId).eq(streamId.add(1))
      expect(newStreamId).eq(streamId.add(2))

      // verify new main stream
      const streamObject = await this.contracts.sablier.getStream(newStreamId);
      expect(streamObject.sender).equal(this.contracts.streamPie.address); // streampie contract is sender
      expect(streamObject.recipient).equal(this.signers.recipient.address); // recipient still is recipient
      expect(streamObject.deposit).equal(STREAM_DEPOSIT.mul(totalStreamPieTokens.sub(tokensToBurn)).div(totalStreamPieTokens));
      expect(streamObject.tokenAddress).equal(this.contracts.token.address);
      expect(streamObject.startTime).equal(startTime);
      expect(streamObject.stopTime).equal(stopTime);
      expect(streamObject.remainingBalance).equal(STREAM_DEPOSIT.mul(totalStreamPieTokens.sub(tokensToBurn)).div(totalStreamPieTokens));

      // verify fork stream
      const forkStreamObject = await this.contracts.sablier.getStream(forkStreamId);
      expect(forkStreamObject.sender).equal(this.contracts.streamPie.address); // streampie contract is sender
      expect(forkStreamObject.recipient).equal(this.signers.deployer.address); // recipient is now deployer
      expect(forkStreamObject.deposit).equal(STREAM_DEPOSIT.mul(tokensToBurn).div(totalStreamPieTokens));
      expect(forkStreamObject.tokenAddress).equal(this.contracts.token.address);
      expect(forkStreamObject.startTime).equal(startTime);
      expect(forkStreamObject.stopTime).equal(stopTime);
      expect(forkStreamObject.remainingBalance).equal(STREAM_DEPOSIT.mul(tokensToBurn).div(totalStreamPieTokens));
    })

    it.only('ragestream burns 100% of remaining shares - skips recreating streampie', async function() {
      const streamId = this.streamId

      // use deployer as recipient for ragestream (deployer has 100% of initial streamPie tokens)
      await this.contracts.streamPie.connect(this.signers.deployer).approve(this.contracts.streamPie.address, totalStreamPieTokens)
      await this.contracts.streamPie.connect(this.signers.deployer).rageStream(this.signers.deployer.address, totalStreamPieTokens)

      const forkStreamId = await this.contracts.streamPie.forks(0)
      const newStreamId = await this.contracts.streamPie.streamPieId()

      expect(forkStreamId).eq(streamId.add(1))
      expect(newStreamId).eq(streamId)

      // verify new main stream - DNE
      await expect(this.contracts.sablier.getStream(newStreamId)).to.be.revertedWith("stream does not exist")

      // verify fork stream
      const forkStreamObject = await this.contracts.sablier.getStream(forkStreamId);
      expect(forkStreamObject.sender).equal(this.contracts.streamPie.address); // streampie contract is sender
      expect(forkStreamObject.recipient).equal(this.signers.deployer.address); // recipient is now deployer
      expect(forkStreamObject.deposit).equal(STREAM_DEPOSIT); // 100% of deposit in fork stream
      expect(forkStreamObject.tokenAddress).equal(this.contracts.token.address);
      expect(forkStreamObject.startTime).equal(startTime);
      expect(forkStreamObject.stopTime).equal(stopTime);
      expect(forkStreamObject.remainingBalance).equal(STREAM_DEPOSIT); // 100% of deposit 
    })

    it.only('two subsequent ragestreams', async function() {
      const streamId = this.streamId

      // use deployer as recipient for ragestream (deployer has 100% of initial streamPie tokens)
      await this.contracts.streamPie.connect(this.signers.deployer).approve(this.contracts.streamPie.address, MaxUint256)
      await this.contracts.streamPie.connect(this.signers.deployer).rageStream(this.signers.deployer.address, tokensToBurn)
      await this.contracts.streamPie.connect(this.signers.deployer).rageStream(this.signers.sender.address, tokensToBurn)

      const forkStreamId_1 = await this.contracts.streamPie.forks(0)
      const forkStreamId_2 = await this.contracts.streamPie.forks(1)
      const newStreamId = await this.contracts.streamPie.streamPieId()

      expect(forkStreamId_1).eq(streamId.add(1))
      expect(forkStreamId_2).eq(streamId.add(3))
      expect(newStreamId).eq(streamId.add(2))

      // verify new main stream - DNE
      await expect(this.contracts.sablier.getStream(newStreamId)).to.be.revertedWith("stream does not exist")

      // verify fork stream #1
      const forkStreamObject_1 = await this.contracts.sablier.getStream(forkStreamId_1);
      expect(forkStreamObject_1.sender).equal(this.contracts.streamPie.address); // streampie contract is sender
      expect(forkStreamObject_1.recipient).equal(this.signers.deployer.address); // recipient is now deployer
      expect(forkStreamObject_1.deposit).equal(STREAM_DEPOSIT.mul(tokensToBurn).div(totalStreamPieTokens));
      expect(forkStreamObject_1.tokenAddress).equal(this.contracts.token.address);
      expect(forkStreamObject_1.startTime).equal(startTime);
      expect(forkStreamObject_1.stopTime).equal(stopTime);
      expect(forkStreamObject_1.remainingBalance).equal(STREAM_DEPOSIT.mul(tokensToBurn).div(totalStreamPieTokens));

      // verify fork stream #2
      const forkStreamObject_2 = await this.contracts.sablier.getStream(forkStreamId_2);
      expect(forkStreamObject_2.sender).equal(this.contracts.streamPie.address); // streampie contract is sender
      expect(forkStreamObject_2.recipient).equal(this.signers.sender.address); // sender is now recipient 
      expect(forkStreamObject_2.deposit).equal(STREAM_DEPOSIT.mul(tokensToBurn).div(totalStreamPieTokens));
      expect(forkStreamObject_2.tokenAddress).equal(this.contracts.token.address);
      expect(forkStreamObject_2.startTime).equal(startTime);
      expect(forkStreamObject_2.stopTime).equal(stopTime);
      expect(forkStreamObject_2.remainingBalance).equal(STREAM_DEPOSIT.mul(tokensToBurn).div(totalStreamPieTokens));
    })

    it('fails if sender didnt approve', async function() {
      const streamId = this.streamId

      // use deployer as recipient for ragestream (deployer has 100% of initial streamPie tokens)
      // await this.contracts.streamPie.connect(this.signers.deployer).approve(this.contracts.streamPie.address, tokensToBurn)
      await expect(this.contracts.streamPie
        .connect(this.signers.deployer)
        .rageStream(this.signers.deployer.address, tokensToBurn)
      ).to.be.revertedWith('SafeMath: subtraction overflow')
    })

    it('fails if sender doesnt have tokens', async function() {
      const streamId = this.streamId

      await this.contracts.streamPie.connect(this.signers.deployer).approve(this.contracts.streamPie.address, tokensToBurn)
      // transfer 690k to recipient so we have approved enough but our balance is too low
      await this.contracts.streamPie.connect(this.signers.deployer).transfer(this.signers.recipient.address, 690000)
      await expect(this.contracts.streamPie
        .connect(this.signers.deployer)
        .rageStream(this.signers.deployer.address, tokensToBurn)
      ).to.be.revertedWith('not enough tokens to burn')
    })

    it('fails if sender burns 0 tokens', async function() {
      // use deployer as recipient for ragestream (deployer has 100% of initial streamPie tokens)
      await this.contracts.streamPie.connect(this.signers.deployer).approve(this.contracts.streamPie.address, tokensToBurn)
      await expect(this.contracts.streamPie
        .connect(this.signers.deployer)
        .rageStream(this.signers.deployer.address, 0) // burn 0 tokens
      ).to.be.revertedWith("deposit is zero")
    })
  })

  context("with the streampie started but not yet finished", function () {
    let snapshotId: any

    beforeEach(async function() {
      snapshotId = await snapshot()
      await moveToBlockTime(now.add(TIME_OFFSET).add(5).toNumber())
    })

    afterEach(async function() {
      await revert(snapshotId)
    })

    it('creates a new sablier stream', async function() {
      const streamId = this.streamId

      // use deployer as recipient for ragestream (deployer has 100% of initial streamPie tokens)
      await this.contracts.streamPie.connect(this.signers.deployer).approve(this.contracts.streamPie.address, tokensToBurn)
      await this.contracts.streamPie.connect(this.signers.deployer).rageStream(this.signers.deployer.address, tokensToBurn)

      const forkStreamId = await this.contracts.streamPie.forks(0)
      const newStreamId = await this.contracts.streamPie.streamPieId()

      expect(forkStreamId).eq(streamId.add(1))
      expect(newStreamId).eq(streamId.add(2))

      const recipientBalance = await this.contracts.token.balanceOf(this.signers.recipient.address)
      expect(recipientBalance).above(5000).below(10000) // between 5-10 seconds is allowed (1000 token per second)

      // remaining balance from initial streampie is split between new streapie and ragestream
      const remainingBalance = STREAM_DEPOSIT.sub(recipientBalance)

      // fetch new streampie object (do this early bc we need startTime to calc deposit amounts)
      const streamObject = await this.contracts.sablier.getStream(newStreamId);

      const newStartTime = BigNumber.from(await blockTime())
      const duration = stopTime.sub(newStartTime)

      const forkDeposit = remainingBalance.mul(totalStreamPieTokens.sub(tokensToBurn)).div(totalStreamPieTokens)
      const forkDepositAdjusted = forkDeposit.sub(forkDeposit.mod(duration))

      const streamPieDeposit = remainingBalance.sub(forkDepositAdjusted)
      const streamPieDepositAdjusted = streamPieDeposit.sub(streamPieDeposit.mod(duration))

      // verify new streampie stream
      expect(streamObject.sender).equal(this.contracts.streamPie.address); // streampie contract is sender
      expect(streamObject.recipient).equal(this.signers.recipient.address); // recipient still is recipient
      expect(streamObject.deposit).equal(streamPieDepositAdjusted);
      expect(streamObject.tokenAddress).equal(this.contracts.token.address);
      expect(streamObject.startTime).equal(newStartTime);
      expect(streamObject.stopTime).equal(stopTime);
      expect(streamObject.remainingBalance).equal(streamPieDepositAdjusted);

      // verify fork stream
      const forkStreamObject = await this.contracts.sablier.getStream(forkStreamId);
      expect(forkStreamObject.sender).equal(this.contracts.streamPie.address); // streampie contract is sender
      expect(forkStreamObject.recipient).equal(this.signers.deployer.address); // recipient is now deployer
      expect(forkStreamObject.deposit).equal(forkDepositAdjusted);
      expect(forkStreamObject.tokenAddress).equal(this.contracts.token.address);
      expect(forkStreamObject.startTime).equal(newStartTime);
      expect(forkStreamObject.stopTime).equal(stopTime);
      expect(forkStreamObject.remainingBalance).equal(forkDepositAdjusted);
    })
  })

  context("with the streampie finished", function () {
    let snapshotId: any

    beforeEach(async function() {
      snapshotId = await snapshot()
      await moveToBlockTime(now.add(TIME_OFFSET).add(TIME_DELTA).toNumber())
    })

    afterEach(async function() {
      await revert(snapshotId)
    })

    it('attempting to ragestream fails', async function() {
      await this.contracts.streamPie.connect(this.signers.deployer).approve(this.contracts.streamPie.address, tokensToBurn)
      await expect(this.contracts.streamPie
        .connect(this.signers.deployer)
        .rageStream(this.signers.deployer.address, tokensToBurn)
      ).to.be.revertedWith('streampie has ended')
    })
  })
}
