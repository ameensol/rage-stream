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

    it('reverts bc new streampie deposit is 0', async function() {
      const streamId = this.streamId

      // use deployer as recipient for ragestream (deployer has 100% of initial streamPie tokens)
      await this.contracts.streamPie.connect(this.signers.deployer).approve(this.contracts.streamPie.address, tokensToBurn)
      await expect(this.contracts.streamPie
        .connect(this.signers.deployer)
        .rageStream(this.signers.deployer.address, tokensToBurn)
      ).to.be.revertedWith('streampie has ended')
    })
  })
}
