import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

// Define the contract name and the interface
const CONTRACT_NAME = "SuiToEthBridge";
const CONTRACT_INTERFACE = [
  "function validatorIndex(address) public view returns (uint256)",
  "function validators(uint256) public view returns (address, uint256)",
];

// Write a test suite for the contract
describe(CONTRACT_NAME, () => {
  // Deploy the contract before each test
  async function beforeEach() {
    // Get the signers from the hardhat network
    const signers = await ethers.getSigners();

    // Get the contract factory and deploy the contract
    const contractFactory = await ethers.getContractFactory(CONTRACT_NAME);
    const contract = await contractFactory.deploy();

    return { contract };
  }

  // Write a test case for checking the total weight of validators
  it("should return the correct total weight of validators", async () => {
    const { contract } = await loadFixture(beforeEach);
    await contract.initialize(
      "0x94926b0accee21e61ee900592a039a1075758014",
      10000
    );

    // Get the expected length of validators from the contract constants
    const expectedWeight = await contract.MAX_TOTAL_WEIGHT();

    // Get the actual length of validators by iterating over the array
    let actualWeight = 0;
    const arrLength = await contract.validatorsCount();
    for (let i = 0; i < arrLength; i++) {
      // Get the validator at index i
      const validator = await contract.validators(i);

      actualWeight += Number(validator.weight);
    }

    // Compare the expected and actual lengths
    expect(actualWeight).to.equal(expectedWeight);

    // expect((await contract.validators).length).to.equal(1);
  });
});
