// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "hardhat/console.sol";

contract SuiToEthBridge {
    uint16 public constant MAX_TOTAL_WEIGHT = 10000;
    uint256 public constant MAX_SINGLE_VALIDATOR_WEIGHT = 1000;
    uint256 public constant APPROVAL_THRESHOLD = 3333;

    // A struct to represent a validator
    struct Validator {
        address addr; // The address of the validator
        uint256 weight; // The weight of the validator
    }

    // A mapping from address to validator index
    mapping(address => uint256) public validatorIndex;

    // An array to store the validators
    Validator[] public validators;

    // declaring a new enum type
    enum State {
        Running,
        Stopped
    }
    State public bridgeState;

    // address public immutable owner;
    address public immutable owner;

    // modifier to check if caller is owner
    modifier isOwner() {
        // If the first argument of 'require' evaluates to 'false', execution terminates and all
        // changes to the state and to Ether balances are reverted.
        // This used to consume all gas in old EVM versions, but not anymore.
        // It is often a good idea to use 'require' to check if functions are called correctly.
        // As a second argument, you can also provide an explanation about what went wrong.
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    function stopRunning() public isOwner {
        bridgeState = State.Stopped;
    }

    /**
     * @dev Set contract deployer as owner
     */
    constructor(address firstPK, uint256 firstWeight) {
        console.log("Owner contract deployed by:", msg.sender);
        owner = msg.sender; // 'msg.sender' is sender of current call, contract deployer for a constructor
        addValidator(firstPK, firstWeight);
        bridgeState = State.Running;
    }

    // Define a function that takes a message as a parameter and returns a bytes32 hash
    function hashMessage(string memory message) public pure returns (bytes32) {
        // Concatenate the prefix, the length and the message
        string memory data = string(
            abi.encodePacked(
                "\x19Ethereum Signed Message:\n",
                uintToStr(bytes(message).length),
                message
            )
        );

        // Hash the data using keccak-256 algorithm
        bytes32 hash = keccak256(bytes(data));

        // Return the hash
        return hash;
    }

    // Define a helper function that converts a uint to a string
    function uintToStr(uint _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len - 1;
        while (_i != 0) {
            bstr[k--] = bytes1(uint8(48 + (_i % 10)));
            _i /= 10;
        }
        return string(bstr);
    }

    // function getMessageHash(
    //     address _to,
    //     uint _amount,
    //     string memory _message,
    //     uint _nonce
    // ) public pure returns (bytes32) {
    //     return keccak256(abi.encodePacked(_to, _amount, _message, _nonce));
    // }

    function messageHash(string memory message) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(message));
    }

    function ethereumthSignedMessageHash(
        bytes32 msgHash
    ) public pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked("\x19Ethereum Signed Message:\n32", msgHash)
            );
    }

    // function messageHash(string memory message) public pure returns (bytes32) {
    //     return keccak256(abi.encodePacked(strlen(message), message));
    // }

    // function ethereumthSignedMessageHash(
    //     bytes32 msgHash
    // ) public pure returns (bytes32) {
    //     return
    //         keccak256(
    //             abi.encodePacked("\x19Ethereum Signed Message:\n32", msgHash)
    //         );
    // }

    // A function that verifies an ECDSA signature
    // @param signature The signature bytes
    // @param signer The expected signer address
    // @return True if the signature is valid, false otherwise
    function verify(
        string memory message,
        bytes memory signature,
        address signer
    ) public pure returns (bool) {
        bytes32 msgHash = messageHash(message);
        bytes32 signedMessageHash = ethereumthSignedMessageHash(msgHash);

        return recoverSigner(signedMessageHash, signature) == signer;
    }

    function recoverSigner(
        bytes32 ethSignedMessageHash,
        bytes memory signature
    ) public pure returns (address) {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(signature);

        return ecrecover(ethSignedMessageHash, v, r, s);
    }

    function splitSignature(
        bytes memory sig
    ) public pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(sig.length == 65, "invalid signature length");

        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
    }

    /**
     * @dev Returns the length of a given string
     *
     * @param s The string to measure the length of
     * @return The length of the input string
     */
    function strlen(string memory s) private pure returns (uint256) {
        uint256 len;
        uint256 i = 0;
        uint256 bytelength = bytes(s).length;
        for (len = 0; i < bytelength; len++) {
            bytes1 b = bytes(s)[i];
            if (b < 0x80) {
                i += 1;
            } else if (b < 0xE0) {
                i += 2;
            } else if (b < 0xF0) {
                i += 3;
            } else if (b < 0xF8) {
                i += 4;
            } else if (b < 0xFC) {
                i += 5;
            } else {
                i += 6;
            }
        }
        return len;
    }

    // A function to check if an array contains an element
    function contains(
        address[] memory _array,
        address _element
    ) private pure returns (bool) {
        // Loop through the array
        for (uint256 i = 0; i < _array.length; i++) {
            // Check if the element is equal to the array element
            if (_array[i] == _element) {
                // Return true
                return true;
            }
        }
        // Return false
        return false;
    }

    // A function to add a validator
    function addValidator(address _pk, uint256 _weight) private {
        // Check if the address is not zero
        require(_pk != address(0), "Zero address.");
        // Check if the address is not already a validator
        require(validatorIndex[_pk] == 0, "Already a validator.");
        // Add the validator to the array
        validators.push(Validator(_pk, _weight));
        // Update the validator index
        validatorIndex[_pk] = validators.length;
    }
}
