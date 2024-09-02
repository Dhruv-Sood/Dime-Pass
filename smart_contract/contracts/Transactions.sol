// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Transactions {
   uint256 transactionCount;


   event Transfer(address from , address receiver, uint amount , string message, uint timestamp, string keyword); 

   struct TransferStruct {
    address from;
    address receiver;
    uint amount;
    string message;
    uint timestamp;
    string keyword;
   }

    TransferStruct[] transfers;

    function addToBlockChain(address payable receiver, uint amount, string memory message, string memory keyword) public {
        transactionCount += 1;
        transfers.push(TransferStruct(msg.sender, receiver, amount, message, block.timestamp, keyword));

        emit Transfer(msg.sender, receiver, amount, message, block.timestamp, keyword);

    }

    function getAllTransactions() public view returns (TransferStruct[] memory) {
        return transfers;
    }

    function getTransactioncount() public view returns (uint256) {
        return transactionCount;
    }


}


