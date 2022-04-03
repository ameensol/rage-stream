import { BigNumber } from "@ethersproject/bignumber";
import { MaxUint256 } from "@ethersproject/constants";
import { expect } from "chai";
import dayjs from "dayjs";

import { STREAM_DEPOSIT, TIME_DELTA, TIME_OFFSET, RATE_PER_SECOND } from "../../shared/constants";

export function shouldBehaveLikeCreateStreamPie(): void {
  const now: BigNumber = BigNumber.from(dayjs().unix());
  const startTime: BigNumber = now.add(TIME_OFFSET);
  const stopTime: BigNumber = startTime.add(TIME_DELTA);

  beforeEach(async function () {
    await this.contracts.token.connect(this.signers.sender).approve(this.contracts.streamPie.address, MaxUint256);
  });

  context("when it is not the first time that the stream pie is created", function () {
    it("reverts", async function () {
      await this.contracts.streamPie
        .connect(this.signers.sender)
        .createStreamPie(
          this.signers.recipient.address,
          STREAM_DEPOSIT,
          this.contracts.token.address,
          startTime,
          stopTime,
        );
      await expect(
        this.contracts.streamPie
          .connect(this.signers.sender)
          .createStreamPie(
            this.signers.recipient.address,
            STREAM_DEPOSIT,
            this.contracts.token.address,
            startTime,
            stopTime,
          ),
      ).to.be.revertedWith("only one stream pie can be created");
    });
  });

  context("when it is the first time that the stream pie is created", function() {
    it('should create the streampie and sablier stream', async function() {

      await this.contracts.streamPie
      .connect(this.signers.sender)
      .createStreamPie(
        this.signers.recipient.address,
        STREAM_DEPOSIT,
        this.contracts.token.address,
        startTime,
        stopTime,
      );

      const streamId = await this.contracts.streamPie.streamPieId();
      const streamObject = await this.contracts.sablier.getStream(streamId);
      expect(streamObject.sender).equal(this.contracts.streamPie.address); // streampie is sender
      expect(streamObject.recipient).equal(this.signers.recipient.address);
      expect(streamObject.deposit).equal(STREAM_DEPOSIT);
      expect(streamObject.tokenAddress).equal(this.contracts.token.address);
      expect(streamObject.startTime).equal(startTime);
      expect(streamObject.stopTime).equal(stopTime);
      expect(streamObject.remainingBalance).equal(STREAM_DEPOSIT);
      expect(streamObject.ratePerSecond).equal(RATE_PER_SECOND);
    })
  });

  context("when the owner is different than the sender", function() {
    it('should pull tokens from the sender', async function() {
      const deployer = this.signers.deployer
      await this.contracts.token.connect(this.signers.sender).transfer(deployer.address, STREAM_DEPOSIT)
      await this.contracts.token.connect(deployer).approve(this.contracts.streamPie.address, MaxUint256);

      await this.contracts.streamPie
      .connect(deployer)
      .createStreamPie(
        this.signers.recipient.address,
        STREAM_DEPOSIT,
        this.contracts.token.address,
        startTime,
        stopTime,
      );

      const deployerBalance = await this.contracts.token.balanceOf(deployer.address)
      expect(deployerBalance).equal(0)

      const streamId = await this.contracts.streamPie.streamPieId();
      const streamObject = await this.contracts.sablier.getStream(streamId);
      expect(streamObject.sender).equal(this.contracts.streamPie.address); // streampie is sender
      expect(streamObject.recipient).equal(this.signers.recipient.address);
      expect(streamObject.deposit).equal(STREAM_DEPOSIT);
      expect(streamObject.tokenAddress).equal(this.contracts.token.address);
      expect(streamObject.startTime).equal(startTime);
      expect(streamObject.stopTime).equal(stopTime);
      expect(streamObject.remainingBalance).equal(STREAM_DEPOSIT);
      expect(streamObject.ratePerSecond).equal(RATE_PER_SECOND);
    })

    it('should fail if sender doesnt have tokens', async function() {
      const deployer = this.signers.deployer
      // await this.contracts.token.connect(this.signers.sender).transfer(deployer.address, STREAM_DEPOSIT)
      // await this.contracts.token.connect(deployer).approve(this.contracts.streamPie.address, MaxUint256);

      await expect(this.contracts.streamPie
      .connect(deployer)
      .createStreamPie(
        this.signers.recipient.address,
        STREAM_DEPOSIT,
        this.contracts.token.address,
        startTime,
        stopTime,
      )).to.be.revertedWith("VM Exception while processing transaction: reverted with reason string 'SafeERC20: low-level call failed'");
    })

    it('should fail if sender didnt approve', async function() {
      const deployer = this.signers.deployer
      await this.contracts.token.connect(this.signers.sender).transfer(deployer.address, STREAM_DEPOSIT)
      // await this.contracts.token.connect(deployer).approve(this.contracts.streamPie.address, MaxUint256);

      await expect(this.contracts.streamPie
      .connect(deployer)
      .createStreamPie(
        this.signers.recipient.address,
        STREAM_DEPOSIT,
        this.contracts.token.address,
        startTime,
        stopTime,
      )).to.be.revertedWith("VM Exception while processing transaction: reverted with reason string 'SafeERC20: low-level call failed'");
    })
  });
}
