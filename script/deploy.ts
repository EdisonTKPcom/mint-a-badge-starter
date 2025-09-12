import { ethers } from "hardhat";

async function main() {
  const C = await ethers.getContractFactory("MintABadge");
  const c = await C.deploy();
  await c.waitForDeployment();
  const addr = await c.getAddress();
  console.log("MintABadge deployed:", addr);
}

main().catch((e) => { console.error(e); process.exit(1); });
