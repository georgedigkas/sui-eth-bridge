import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

describe("SuiToEthBridge", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,

  async function beforeEach() {
    const SuiToEthBridge = await ethers.getContractFactory("SuiToEthBridge");
    const s2e = await SuiToEthBridge.deploy();

    return { s2e };
  }

  describe("retrieve", function () {
    it("retrieve returns a value previously stored", async function () {
      const { s2e } = await loadFixture(beforeEach);

      await s2e.initialize("0x94926b0accee21e61ee900592a039a1075758014", 10000);

      // Test if the returned value is the same one
      // Note that we need to use strings to compare the 256 bit integers
      // expect((await box.retrieve()).toString()).to.equal("42");
    });
  });
});
