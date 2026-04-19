// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title VulnerableContract
 * @notice DELIBERATELY VULNERABLE CONTRACT FOR DEMO PURPOSES ONLY
 * @dev This contract contains multiple critical vulnerabilities to demonstrate
 *      Ghost Shell's automatic blocking capabilities. DO NOT USE IN PRODUCTION.
 */
contract VulnerableContract {
    mapping(address => uint256) public balances;
    address public owner;
    
    event Deposit(address indexed user, uint256 amount);
    event Withdrawal(address indexed user, uint256 amount);
    
    constructor() {
        owner = msg.sender;
    }
    
    // VULNERABILITY 1: Reentrancy - External call before state update
    function withdraw(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        // CRITICAL: External call before state update (reentrancy vulnerability)
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        
        // State update AFTER external call - WRONG!
        balances[msg.sender] -= amount;
        
        emit Withdrawal(msg.sender, amount);
    }
    
    // VULNERABILITY 2: Missing access control - Anyone can call this
    function emergencyWithdraw() public {
        // CRITICAL: No access control! Anyone can drain the contract
        uint256 balance = address(this).balance;
        (bool success, ) = msg.sender.call{value: balance}("");
        require(success, "Transfer failed");
    }
    
    // VULNERABILITY 3: Delegatecall to user-controlled address
    function executeCode(address target, bytes memory data) public {
        // CRITICAL: Delegatecall with user-controlled address
        (bool success, ) = target.delegatecall(data);
        require(success, "Delegatecall failed");
    }
    
    // VULNERABILITY 4: Unchecked external call
    function unsafeTransfer(address to, uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        
        // CRITICAL: Return value not checked
        payable(to).call{value: amount}("");
    }
    
    // VULNERABILITY 5: tx.origin authentication
    function transferOwnership(address newOwner) public {
        // CRITICAL: Using tx.origin instead of msg.sender
        require(tx.origin == owner, "Not owner");
        owner = newOwner;
    }
    
    // Deposit function
    function deposit() public payable {
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }
    
    // Fallback to receive ETH
    receive() external payable {
        balances[msg.sender] += msg.value;
    }
}
