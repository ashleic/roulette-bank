// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BankApp {
    struct BankTransaction {
        address user;
        string transactionType;
        uint256 amount;
        uint256 timestamp;
    }

    mapping(address => bool) public registeredWallets;
    BankTransaction[] public transactions;

    event WalletRegistered(address wallet);
    event TransactionRecorded(address wallet, string transactionType, uint256 amount);

    function registerWallet() public {
        registeredWallets[msg.sender] = true;
        emit WalletRegistered(msg.sender);
    }

    function recordTransaction(string memory _transactionType, uint256 _amount) public {
        require(registeredWallets[msg.sender], "Wallet not registered");

        transactions.push(
            BankTransaction(msg.sender, _transactionType, _amount, block.timestamp)
        );

        emit TransactionRecorded(msg.sender, _transactionType, _amount);
    }

    function getTransactionCount() public view returns (uint256) {
        return transactions.length;
    }
}