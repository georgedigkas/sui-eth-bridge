import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

// Define the contract name and the interface
const CONTRACT_NAME = "SuiToEthBridge";
const CONTRACT_INTERFACE = [
  "function initialize(address, uint256) public",
  "function hashMessage(string) public pure returns (bytes32)",
  "function uintToStr(uint) internal pure returns (string)",
  "function messageHash(string) public pure returns (bytes32)",
  "function ethereumthSignedMessageHash(bytes32) public pure returns (bytes32)",
  "function verify(string, bytes, address) public pure returns (bool)",
  "function recoverSigner(bytes32, bytes) public pure returns (address)",
  "function splitSignature(bytes) public pure returns (bytes32, bytes32, uint8)",
  "function strlen(string) private pure returns (uint256)",
  "function contains(address[], address) private pure returns (bool)",
  "function addValidator(address, uint256) private",
  "function validatorsCount() public view returns (uint)",
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
  it("should initialize the contract with the first validator and the bridge state", async () => {
    const { contract } = await loadFixture(beforeEach);

    // Set the first validators's address and weight
    const firstPK = "0x94926B0ACceE21E61EE900592A039a1075758014";
    const firstWeight = 10000;

    // Call the initialize function with the first signer's address and weight
    await contract.initialize(firstPK, firstWeight);

    // Get the first validator from the contract
    const firstValidator = await contract.validators(0);

    // Check if the first validator's address and weight are correct
    expect(firstValidator.addr).to.equal(firstPK);
    expect(firstValidator.weight).to.equal(firstWeight);

    expect((await contract.validatorsCount()).toString()).to.equal("1");

    // Get the bridge state from the contract
    const bridgeState = await contract.bridgeState();

    // Check if the bridge state is running
    expect(bridgeState).to.equal(0); // 0 is the enum value for running
  });

  // // Test the hashMessage function by comparing the output with the expected hash of a given message
  // it("should return the correct hash of a given message", async () => {
  //   const { contract } = await loadFixture(beforeEach);

  //   // Define a message and its expected hash
  //   const message = "Hello, world!";
  //   const expectedHash =
  //     "0x9b4e1a0f7c8f9c0a6c5c2a3d6a0f9f1a9b4e1a0f7c8f9c0a6c5c2a3d6a0f9f1a";

  //   // Call the hashMessage function with the message
  //   const actualHash = await contract.hashMessage(message);

  //   // Compare the actual and expected hashes
  //   expect(actualHash).to.equal(expectedHash);
  // });

  // // Test the verify function by using a valid and an invalid signature for a given message and signer
  // it("should verify a signature for a given message and signer", async () => {
  //   const { contract } = await loadFixture(beforeEach);

  //   // Define a message, a signer, and a valid and an invalid signature
  //   const message = "Hello, world!";
  //   const signer = "0x1234567890123456789012345678901234567890";
  //   const validSignature =
  //     "0x9b4e1a0f7c8f9c0a6c5c2a3d6a0f9f1a9b4e1a0f7c8f9c0a6c5c2a3d6a0f9f1a9b4e1a0f7c8f9c0a6c5c2a3d6a0f9f1a9b4e1a0f7c8f9c0a6c5c2a3d6a0f9f1a1c";
  //   const invalidSignature =
  //     "0x9b4e1a0f7c8f9c0a6c5c2a3d6a0f9f1a9b4e1a0f7c8f9c0a6c5c2a3d6a0f9f1a9b4e1a0f7c8f9c0a6c5c2a3d6a0f9f1a9b4e1a0f7c8f9c0a6c5c2a3d6a0f9f1a1d";

  //   // Call the verify function with the message, the signer, and the valid signature
  //   const validResult = await contract.verify(message, validSignature, signer);

  //   // Check if the result is true
  //   expect(validResult).to.be.true;

  //   // Call the verify function with the message, the signer, and the invalid signature
  //   const invalidResult = await contract.verify(
  //     message,
  //     invalidSignature,
  //     signer
  //   );

  //   // Check if the result is false
  //   expect(invalidResult).to.be.false;
  // });

  // Test the recoverSigner function by using a signature and a message hash that correspond to a known signer
  it("should recover the signer from a signature and a message hash", async () => {
    const { contract } = await loadFixture(beforeEach);

    // Define a message hash, a signer, and a signature
    const messageHash =
      "0x9b4e1a0f7c8f9c0a6c5c2a3d6a0f9f1a9b4e1a0f7c8f9c0a6c5c2a3d6a0f9f1a";
    const signer = "0x1234567890123456789012345678901234567890";
    const signature =
      "0x9b4e1a0f7c8f9c0a6c5c2a3d6a0f9f1a9b4e1a0f7c8f9c0a6c5c2a3d6a0f9f1a9b4e1a0f7c8f9c0a6c5c2a3d6a0f9f1a9b4e1a0f7c8f9c0a6c5c2a3d6a0f9f1a1c";

    // Call the recoverSigner function with the message hash and the signature
    const recoveredSigner = await contract.recoverSigner(
      messageHash,
      signature
    );

    // Compare the recovered signer with the expected signer
    expect(recoveredSigner).to.equal(signer);
  });

  // // Test the recoverSigner function by using a signature and a message hash that correspond to a known signer
  // it("should recover the signer from a signature and a message hash", async () => {
  //   const { contract } = await loadFixture(beforeEach);

  //   // Define a signature and its expected r, s, and v values
  //   const signature =
  //     "0x9b4e1a0f7c8f9c0a6c5c2a3d6a0f9f1a9b4e1a0f7c8f9c0a6c5c2a3d6a0f9f1a9b4e1a0f7c8f9c0a6c5c2a3d6a0f9f1a9b4e1a0f7c8f9c0a6c5c2a3d6a0f9f1a1c";
  //   const expectedR =
  //     "0x9b4e1a0f7c8f9c0a6c5c2a3d6a0f9f1a9b4e1a0f7c8f9c0a6c5c2a3d6a0f9f1a";
  //   const expectedS =
  //     "0x9b4e1a0f7c8f9c0a6c5c2a3d6a0f9f1a9b4e1a0f7c8f9c0a6c5c2a3d6a0f9f1a";
  //   const expectedV = 28;

  //   // Call the splitSignature function with the signature
  //   const [actualR, actualS, actualV] = await contract.splitSignature(
  //     signature
  //   );

  //   // Compare the actual and expected r, s, and v values
  //   expect(actualR).to.equal(expectedR);
  //   expect(actualS).to.equal(expectedS);
  //   expect(actualV).to.equal(expectedV);
  // });

  // Write a test case for checking the total weight of validators
  it("should return the correct total weight of validators", async () => {
    const { contract } = await loadFixture(beforeEach);
    await contract.initialize(
      "0x94926B0ACceE21E61EE900592A039a1075758014",
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
