import { ethers, upgrades } from "hardhat";

const UPGRADEABLE_PROXY = "Insert your proxy contract address here";

async function main() {
  const SuiToEthBridge = await ethers.getContractFactory("SuiToEthBridge");

  console.log("Upgrading SuiToEthBridge...");
  let upgrade = await upgrades.upgradeProxy(UPGRADEABLE_PROXY, SuiToEthBridge);
  console.log("Upgraded to New Version!");
  console.log("Upgraded Contract Deployed To:", await upgrade.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// https://www.quicknode.com/guides/ethereum-development/smart-contracts/how-to-create-and-deploy-an-upgradeable-smart-contract-using-openzeppelin-and-hardhat
