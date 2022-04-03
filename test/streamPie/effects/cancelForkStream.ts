import { BigNumber } from "@ethersproject/bignumber";
import { MaxUint256 } from "@ethersproject/constants";
import { expect } from "chai";
import dayjs from "dayjs";

import { STREAM_DEPOSIT, TIME_DELTA, TIME_OFFSET } from "../../shared/constants";
import { blockTime, moveToBlockTime, snapshot, revert } from "../../shared/util";

export function shouldBehaveLikeCancelForkStream(): void {
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
    await this.contracts.streamPie.connect(this.signers.deployer).approve(this.contracts.streamPie.address, tokensToBurn)
    await this.contracts.streamPie.connect(this.signers.deployer).rageStream(this.signers.deployer.address, tokensToBurn)
  })

  context("with the ragestream before the stream has started", function () {
    it("owner can cancel the forkstream - owner receives all tokens", async function() {
      const expectedForkDeposit = STREAM_DEPOSIT.mul(tokensToBurn).div(totalStreamPieTokens)

      const balance = await this.contracts.token.balanceOf(this.signers.sender.address)
      expect(balance).eq(0) // sender starts with 0 

      await this.contracts.streamPie.connect(this.signers.sender).cancelForkStream(0)

      const newBalance = await this.contracts.token.balanceOf(this.signers.sender.address)
      expect(newBalance).equal(balance.add(expectedForkDeposit)) // sender ends up with 100% of fork deposit
    })

    it("fails when trying to cancel a non-existant fork", async function() {
      await expect(this.contracts.streamPie
        .connect(this.signers.sender)
        .cancelForkStream(1)
      ).to.be.reverted
    })   

    it("fails when non-owner attempts to cancel", async function() {
      await expect(this.contracts.streamPie
        .connect(this.signers.deployer)
        .cancelForkStream(0)
      ).to.be.revertedWith("only owner is allowed to cancel a fork stream")
    })   

    it("fails when trying to cancel twice", async function() {
      await this.contracts.streamPie.connect(this.signers.sender).cancelForkStream(0)
      await expect(this.contracts.streamPie
        .connect(this.signers.sender)
        .cancelForkStream(0)
      ).to.be.revertedWith('stream does not exist')
    })
  })
}
