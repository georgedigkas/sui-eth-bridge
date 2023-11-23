import { ethers, upgrades } from "hardhat";

async function main() {
  // const gas = await ethers.provider.getGasPrice();
  const SuiToEthBridge = await ethers.getContractFactory("SuiToEthBridge");
  console.log("Deploying SuiToEthBridge...");
  const v1SuiToEthBridgeContract = await upgrades.deployProxy(
    SuiToEthBridge,
    ["0x94926b0accee21e61ee900592a039a1075758014", 1000],
    {
      initializer: "initialize",
    }
  );
  await SuiToEthBridge.deploy();
  console.log(
    "V1 SuiToEthBridge Contract deployed to:",
    await v1SuiToEthBridgeContract.getAddress()
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// async function main() {
//   const [deployer] = await ethers.getSigners();

//   console.log("Deploying contracts with the account:", deployer.address);

//   const SuiToEthBridge = await ethers.getContractFactory("SuiToEthBridge");
//   const contract = await SuiToEthBridge.deploy();

//   console.log("Contract deployed at:", contract.getAddress());
// }

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });

// async function main() {
//   const SuiToEthBridge = await ethers.getContractFactory("SuiToEthBridge");
//   console.log("Deploying SuiToEthBridge...");
//   const s2e = await upgrades.deployProxy(
//     SuiToEthBridge,
//     ["0x94926b0accee21e61ee900592a039a1075758014", 1000],
//     { initializer: "initialize" }
//   );
//   console.log("SuiToEthBridge deployed to:", await s2e.getAddress());
// }

// // This pattern is recommended in order to be able to use async/await everywhere and properly handle errors.
// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });
