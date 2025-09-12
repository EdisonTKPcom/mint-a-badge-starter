import { expect } from "chai";
import { ethers } from "hardhat";

describe("MintABadge", () => {
  it("mints once per wallet", async () => {
    const [a] = await ethers.getSigners();
    const C = await ethers.getContractFactory("MintABadge");
    const c = await C.deploy();
    await c.waitForDeployment();

    await (await c.connect(a).mint()).wait();
    await expect(c.connect(a).mint()).to.be.revertedWith("Already minted");
  });
});
