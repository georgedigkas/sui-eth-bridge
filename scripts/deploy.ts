import { ethers, upgrades } from "hardhat";

async function main() {
  const SuiToEthBridge = await ethers.getContractFactory("SuiToEthBridge");
  console.log("Deploying SuiToEthBridge...");
  const s2e = await upgrades.deployProxy(
    SuiToEthBridge,
    ["0x94926b0accee21e61ee900592a039a1075758014", 1000],
    { initializer: "initialize" }
  );
  console.log("SuiToEthBridge deployed to:", await s2e.getAddress());
}

// This pattern is recommended in order to be able to use async/await everywhere and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
