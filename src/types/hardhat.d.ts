/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import * as Contracts from ".";
import {
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomiclabs/hardhat-ethers/types";
import { ethers } from "ethers";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "MinterRole",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MinterRole__factory>;
    getContractFactory(
      name: "ERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20__factory>;
    getContractFactory(
      name: "ERC20Mintable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20Mintable__factory>;
    getContractFactory(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20__factory>;
    getContractFactory(
      name: "ReentrancyGuard",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ReentrancyGuard__factory>;
    getContractFactory(
      name: "MetaSablier",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MetaSablier__factory>;
    getContractFactory(
      name: "ISablier",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ISablier__factory>;
    getContractFactory(
      name: "Sablier",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Sablier__factory>;
    getContractFactory(
      name: "Imports",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Imports__factory>;

    getContractAt(
      name: "MinterRole",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.MinterRole>;
    getContractAt(
      name: "ERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20>;
    getContractAt(
      name: "ERC20Mintable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20Mintable>;
    getContractAt(
      name: "IERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20>;
    getContractAt(
      name: "ReentrancyGuard",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ReentrancyGuard>;
    getContractAt(
      name: "MetaSablier",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.MetaSablier>;
    getContractAt(
      name: "ISablier",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ISablier>;
    getContractAt(
      name: "Sablier",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Sablier>;
    getContractAt(
      name: "Imports",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Imports>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.utils.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
  }
}
