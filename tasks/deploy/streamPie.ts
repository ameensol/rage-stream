import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { task, types } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { StreamPie } from "../../src/types/contracts/StreamPie.sol/StreamPie";
import { Sablier } from "../../src/types/contracts/sablier/Sablier";
import { StreamPie__factory } from "../../src/types/factories/contracts/StreamPie.sol/StreamPie__factory";
import { Sablier__factory } from "../../src/types/factories/contracts/sablier/Sablier__factory";

task("deploy:StreamPie")
  .addParam("development", "Whether to deploy the Sablier contract", false, types.boolean)
  .addParam("sablier", "Address of Sablier contract", false, types.string)
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    let sablierAddress;

    if (taskArguments.development) {
      const sablierFactory: Sablier__factory = <Sablier__factory>await ethers.getContractFactory("Sablier");
      const sablier: Sablier = <Sablier>await sablierFactory.deploy();
      sablierAddress = sablier.address;
    } else {
      if (taskArguments.sablier) {
        throw new Error("Sablier address not provided");
      }
      sablierAddress = taskArguments.sablier;
    }

    const signers: SignerWithAddress[] = await ethers.getSigners();
    const streamPieFactory: StreamPie__factory = <StreamPie__factory>(
      await ethers.getContractFactory("StreamPie")
    );
    const streamPie: StreamPie = <StreamPie>await streamPieFactory.deploy(signers[0].address, sablierAddress);
    await streamPie.deployed();
    console.log("StreamPie deployed to: ", streamPie.address);
  });
