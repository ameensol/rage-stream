import { BigNumber } from "@ethersproject/bignumber";
import { MaxUint256 } from "@ethersproject/constants";
import { expect } from "chai";
import dayjs from "dayjs";

import { STREAM_DEPOSIT, TIME_DELTA, TIME_OFFSET } from "../../shared/constants";
import { moveToBlockTime, snapshot, revert } from "../../shared/util";

export function shouldBehaveLikeCancelStreamPie(): void {
  const now: BigNumber = BigNumber.from(dayjs().unix());
  const startTime: BigNumber = now.add(TIME_OFFSET);
  const stopTime: BigNumber = startTime.add(TIME_DELTA);

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
    it("the owner can cancel the streampie", async function () {
      await this.contracts.streamPie.connect(this.signers.sender).cancelStreamPie()
      await expect(
        this.contracts.sablier
          .connect(this.signers.sender)
          .getStream(this.streamId.toNumber())
        ).to.be.reverted
    })

    it("fails if non-owner attempts to cancel streampie", async function () {
      await expect(
        this.contracts.streamPie
          .connect(this.signers.deployer)
          .cancelStreamPie()
      ).to.be.revertedWith('only owner is allowed to cancel stream pie')

    })

    it("the owner receives the tokens", async function () {
      const balance = await this.contracts.token.balanceOf(this.signers.sender.address)
      await this.contracts.streamPie.connect(this.signers.sender).cancelStreamPie()
      const newBalance = await this.contracts.token.balanceOf(this.signers.sender.address)
      expect(newBalance).equal(balance.add(STREAM_DEPOSIT))
    })

    it("recipient can cancel via sablier contract - streampie contract receives the tokens", async function () {
      const balance = await this.contracts.token.balanceOf(this.signers.sender.address)
      await this.contracts.sablier.connect(this.signers.recipient).cancelStream(this.streamId)
      const newBalance = await this.contracts.token.balanceOf(this.contracts.streamPie.address)
      expect(newBalance).equal(balance.add(STREAM_DEPOSIT))
    })
  })

  context("with the streampie started but not finished", function () {
    let snapshotId: any

    beforeEach(async function() {
      snapshotId = await snapshot()
      await moveToBlockTime(now.add(TIME_OFFSET).add(5).toNumber())
    })

    afterEach(async function() {
      await revert(snapshotId)
    })

    it("the owner can cancel the streampie", async function () {
      await this.contracts.streamPie.connect(this.signers.sender).cancelStreamPie()
      await expect(
        this.contracts.sablier
          .connect(this.signers.sender)
          .getStream(this.streamId)
        ).to.be.reverted
    })

    it("the owner and recipient receive their tokens", async function () {
      const ownerBalance = await this.contracts.token.balanceOf(this.signers.sender.address)
      const recipientBalance = await this.contracts.token.balanceOf(this.signers.recipient.address)
      await this.contracts.streamPie.connect(this.signers.sender).cancelStreamPie()
      const newOwnerBalance = await this.contracts.token.balanceOf(this.signers.sender.address)
      const newRecipientBalance = await this.contracts.token.balanceOf(this.signers.recipient.address)

      expect(ownerBalance).eq(0) // owner starts at 0
      expect(recipientBalance).eq(0) // recipient starts at 0
      expect(STREAM_DEPOSIT.sub(newOwnerBalance)).equal(newRecipientBalance) // conservation of tokens
      expect(newRecipientBalance).above(5000).below(10000) // between 5-10 seconds is allowed (1000 token per second)
    })

    it("recipient can cancel via sablier contract - streampie contract and recipient receive the tokens", async function () {
      const streamPieBalance = await this.contracts.token.balanceOf(this.contracts.streamPie.address)
      const recipientBalance = await this.contracts.token.balanceOf(this.signers.recipient.address)
      await this.contracts.sablier.connect(this.signers.recipient).cancelStream(this.streamId)
      const newStreamPieBalance = await this.contracts.token.balanceOf(this.contracts.streamPie.address)
      const newRecipientBalance = await this.contracts.token.balanceOf(this.signers.recipient.address)

      expect(streamPieBalance).eq(0) // streamPie starts at 0
      expect(recipientBalance).eq(0) // recipient starts at 0
      expect(STREAM_DEPOSIT.sub(newStreamPieBalance)).equal(newRecipientBalance) // conservation of tokens
      expect(newRecipientBalance).above(5000).below(10000) // between 5-10 seconds is allowed (1000 token per second)
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

    it("the owner can cancel the streampie", async function () {
      await this.contracts.streamPie.connect(this.signers.sender).cancelStreamPie()
      await expect(
        this.contracts.sablier
          .connect(this.signers.sender)
          .getStream(this.streamId)
        ).to.be.reverted
    })

    it("the recipient receives the tokens", async function () {
      const ownerBalance = await this.contracts.token.balanceOf(this.signers.sender.address)
      const recipientBalance = await this.contracts.token.balanceOf(this.signers.recipient.address)
      await this.contracts.streamPie.connect(this.signers.sender).cancelStreamPie()
      const newOwnerBalance = await this.contracts.token.balanceOf(this.signers.sender.address)
      const newRecipientBalance = await this.contracts.token.balanceOf(this.signers.recipient.address)

      expect(ownerBalance).eq(0) // owner starts at 0
      expect(recipientBalance).eq(0) // recipient starts at 0
      expect(newOwnerBalance).eq(0) // owner still 0
      expect(newRecipientBalance).equal(STREAM_DEPOSIT) // recipient gets entire deposit
    })

    it("recipient can cancel via sablier contract - recipient receives the tokens", async function () {
      const streamPieBalance = await this.contracts.token.balanceOf(this.contracts.streamPie.address)
      const recipientBalance = await this.contracts.token.balanceOf(this.signers.recipient.address)
      await this.contracts.sablier.connect(this.signers.recipient).cancelStream(this.streamId)
      const newStreamPieBalance = await this.contracts.token.balanceOf(this.contracts.streamPie.address)
      const newRecipientBalance = await this.contracts.token.balanceOf(this.signers.recipient.address)

      expect(streamPieBalance).eq(0) // streamPie starts at 0
      expect(recipientBalance).eq(0) // recipient starts at 0
      expect(newStreamPieBalance).eq(0) // streamPie still 0
      expect(newRecipientBalance).equal(STREAM_DEPOSIT) // recipient gets entire deposit
    })
  })
}
