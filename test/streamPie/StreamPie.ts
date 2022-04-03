import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { artifacts, ethers, waffle } from "hardhat";
import type { Artifact } from "hardhat/types";

import type { ERC20Mintable } from "../../src/types/@openzeppelin/contracts/token/ERC20/ERC20Mintable";
import type { StreamPie } from "../../src/types/contracts/StreamPie";
import type { Sablier } from "../../src/types/contracts/sablier/Sablier";
import { STREAM_DEPOSIT } from "../shared/constants";
import { Contracts, Signers } from "../types";
import { shouldBehaveLikeStreamPie } from "./StreamPie.behavior";

describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;
    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.deployer = signers[0];
    this.signers.sender = signers[1];
    this.signers.recipient = signers[2];
  });

  describe("StreamPie", function () {
    beforeEach(async function () {
      this.contracts = {} as Contracts;

      // Deploy the dummy ERC20Mintable contract
      const erc20MintableArtifact: Artifact = await artifacts.readArtifact("ERC20Mintable");
      this.contracts.token = <ERC20Mintable>(
        await waffle.deployContract(this.signers.deployer, erc20MintableArtifact, [])
      );

      // Mint 3600 tokens to the stream sender
      await this.contracts.token.mint(this.signers.sender.address, STREAM_DEPOSIT);

      // Deploy the Sablier contract
      const sablierArtifact: Artifact = await artifacts.readArtifact("Sablier");
      this.contracts.sablier = <Sablier>await waffle.deployContract(this.signers.deployer, sablierArtifact, []);

      // Deploy the StreamPie contract by making the "sender" the owner
      const streamPieArtifact: Artifact = await artifacts.readArtifact("StreamPie");
      this.contracts.streamPie = <StreamPie>(
        await waffle.deployContract(this.signers.deployer, streamPieArtifact, [
          this.signers.sender.address,
          this.contracts.sablier.address,
        ])
      );
    });

    shouldBehaveLikeStreamPie();
  });
});
