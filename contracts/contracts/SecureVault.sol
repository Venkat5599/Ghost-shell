// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./GhostShellGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title SecureVault
 * @notice Example vault protected by Ghost Shell
 * @dev Demonstrates how to use GhostShellGuard in your contracts
 */
contract SecureVault is GhostShellGuard, ReentrancyGuard {
    
    mapping(address => mapping(address => uint256)) public balances;
    
    event Deposit(address indexed user, address indexed token, uint256 amount);
    event Withdraw(address indexed user, address indexed token, uint256 amount);
    event Transfer(address indexed from, address indexed to, address indexed token, uint256 amount);
    
    constructor(address _registry) GhostShellGuard(_registry) {}
    
    /**
     * @notice Deposit tokens into the vault
     * @param token Token address (protected by Ghost Shell)
     * @param amount Amount to deposit
     */
    function deposit(address token, uint256 amount) 
        external 
        nonReentrant
        ghostShellProtected(token) // Security check!
    {
        require(amount > 0, "Amount must be > 0");
        
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        balances[msg.sender][token] += amount;
        
        emit Deposit(msg.sender, token, amount);
    }
    
    /**
     * @notice Withdraw tokens from the vault
     * @param token Token address
     * @param amount Amount to withdraw
     */
    function withdraw(address token, uint256 amount) 
        external 
        nonReentrant 
    {
        require(amount > 0, "Amount must be > 0");
        require(balances[msg.sender][token] >= amount, "Insufficient balance");
        
        balances[msg.sender][token] -= amount;
        IERC20(token).transfer(msg.sender, amount);
        
        emit Withdraw(msg.sender, token, amount);
    }
    
    /**
     * @notice Transfer tokens to another user within the vault
     * @param to Recipient address (protected by Ghost Shell)
     * @param token Token address
     * @param amount Amount to transfer
     */
    function transfer(address to, address token, uint256 amount) 
        external 
        nonReentrant
        ghostShellProtected(to) // Check recipient safety!
    {
        require(to != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be > 0");
        require(balances[msg.sender][token] >= amount, "Insufficient balance");
        
        balances[msg.sender][token] -= amount;
        balances[to][token] += amount;
        
        emit Transfer(msg.sender, to, token, amount);
    }
    
    /**
     * @notice Get user balance
     * @param user User address
     * @param token Token address
     * @return balance User's balance
     */
    function getBalance(address user, address token) 
        external 
        view 
        returns (uint256) 
    {
        return balances[user][token];
    }
}
