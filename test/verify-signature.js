const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VerifySignature", function () {
  it("Check signature", async function () {
    const accounts = await ethers.getSigners(1);

    const SuiToEthBridge = await ethers.getContractFactory("SuiToEthBridge");
    const contract = await SuiToEthBridge.deploy(
      "0x94926b0accee21e61ee900592a039a1075758014",
      1000
    );
    await contract.deployed();

    const PRIV_KEY =
      "0x3f614a2b69459e93371336703571a74af91cab7ba05fd56a66b55eb1ba24ce55";
    const signer = new ethers.Wallet(PRIV_KEY);
    // const signer = accounts[0];
    // const signerAddress = ;
    console.log("publicKey:", signer.publicKey);

    const initMessage = "Hello, World!";
    const message = initMessage; //initMessage.length + initMessage;
    console.log("message", message);

    const hash = await contract.messageHash(message);
    console.log("hash", hash);
    const sig = await signer.signMessage(ethers.utils.arrayify(hash));

    console.log(sig);

    const ethHash = await contract.ethereumthSignedMessageHash(hash);
    console.log("ethHash", ethHash);

    console.log("signer          ", signer.address);
    console.log("recovered signer", await contract.recoverSigner(ethHash, sig));

    // Correct signature and message returns true
    expect(await contract.verify(message, sig, signer.address)).to.equal(true);

    // Incorrect message returns false
    expect(await contract.verify("Fail!", sig, signer.address)).to.equal(false);

    console.log("---------");
    console.log(PRIV_KEY);
    console.log(signer.publicKey);
    console.log(message);
    console.log(signer.address);
    console.log(sig);
  });
});
