import { ethers } from 'hardhat'

export async function blockTime() {
  const block = await ethers.provider.getBlock('latest')
  return block.timestamp
}

export async function moveToBlockTime(blockTime: any) {
  await ethers.provider.send("evm_mine", [blockTime])
  return true
}

export async function snapshot() {
    return await ethers.provider.send("evm_snapshot", [])
}

export async function revert(snapshotId: any) {
    await ethers.provider.send("evm_revert", [snapshotId])
}