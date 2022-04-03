import { BigNumber } from "@ethersproject/bignumber";
import { MaxUint256 } from "@ethersproject/constants";
import { expect } from "chai";
import dayjs from "dayjs";

import { STREAM_DEPOSIT, TIME_DELTA, TIME_OFFSET } from "../../shared/constants";

export function shouldBehaveLikeWithdrawTokens(): void {
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
    await this.contracts.sablier.connect(this.signers.recipient).cancelStream(this.streamId)
  })

  context("with the streampie created but not started - recipient cancels directly on sablier", function () {
    it("non-owner can call withdraw - tokens go to owner", async function () {
      const balance = await this.contracts.token.balanceOf(this.signers.sender.address)
      expect(balance).eq(0)

      await this.contracts.streamPie.connect(this.signers.deployer).withdrawTokens()
      
      const newBalance = await this.contracts.token.balanceOf(this.signers.sender.address)
      expect(newBalance).equal(STREAM_DEPOSIT)
    })
  })
}
