import { BigNumber } from "@ethersproject/bignumber";
import { MaxUint256 } from "@ethersproject/constants";
import { expect } from "chai";
import dayjs from "dayjs";

import { STREAM_DEPOSIT, TIME_DELTA, TIME_OFFSET } from "../../shared/constants";

export function shouldBehaveLikeConstructor(): void {
  const now: BigNumber = BigNumber.from(dayjs().unix());
  const startTime: BigNumber = now.add(TIME_OFFSET);
  const stopTime: BigNumber = startTime.add(TIME_DELTA);

  context("after deployment", function () {
      it("should be initialized correctly", async function() { 
        // sablier contract address set
        const sablierAddress = await this.contracts.streamPie.sablier()
        expect(sablierAddress).equal(this.contracts.sablier.address)

        // streamPie deployer gets the initial 1M tokens
        const streamPieBalance = +(await this.contracts.streamPie.balanceOf(this.signers.deployer.address)).toString()
        expect(streamPieBalance).equal(1000000)

        // owners is set properly
        const owner = await this.contracts.streamPie.owner()
        expect(owner).equal(this.signers.sender.address)
      })
  })
}
