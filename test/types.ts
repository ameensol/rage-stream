import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import type { Fixture } from "ethereum-waffle";

import type { ERC20Mintable } from "../src/types/@openzeppelin/contracts/token/ERC20/ERC20Mintable";
import type { StreamPie } from "../src/types/contracts/StreamPie";
import type { Sablier } from "../src/types/contracts/sablier/Sablier";

declare module "mocha" {
  export interface Context {
    contracts: Contracts;
    loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
    signers: Signers;
  }
}

export interface Contracts {
  streamPie: StreamPie;
  sablier: Sablier;
  token: ERC20Mintable;
}
export interface Signers {
  deployer: SignerWithAddress;
  recipient: SignerWithAddress;
  sender: SignerWithAddress;
}
