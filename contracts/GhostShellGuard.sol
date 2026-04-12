// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./GhostShellRegistry.sol";

/**
 * @title GhostShellGuard
 * @notice Pre-transaction security guard that blocks risky interactions
 * @dev Inherit this contract to add automatic security checks
 */
abstract contract GhostShellGuard {
    
    GhostShellRegistry public immutable registry;
    
    event TransactionBlocked(
        address indexed user,
        address indexed target,
        string reason
    );
    
    event RiskWarning(
        address indexed user,
        address indexed target,
        uint256 riskScore
    );
    
    constructor(address _registry) {
        require(_registry != address(0), "Invalid registry address");
        registry = GhostShellRegistry(_registry);
    }
    
    /**
     * @notice Check if interaction with target is safe
     * @param target Address to check
     * @return isSafe True if safe to interact
     */
    modifier ghostShellProtected(address target) {
        _checkSecurity(target);
        _;
    }
    
    /**
     * @notice Internal security check
     * @param target Address to verify
     */
    function _checkSecurity(address target) internal view {
        GhostShellRegistry.SecurityManifest memory manifest = registry.getManifest(target);
        
        // If no manifest exists, allow (permissive mode)
        if (manifest.timestamp == 0) {
            return;
        }
        
        // Block critical risk contracts
        require(
            manifest.riskLevel != GhostShellRegistry.RiskLevel.CRITICAL,
            "Ghost Shell: CRITICAL RISK - Transaction blocked"
        );
        
        // Emit warning for medium risk
        if (manifest.riskLevel == GhostShellRegistry.RiskLevel.WARNING) {
            emit RiskWarning(msg.sender, target, manifest.riskScore);
        }
    }
    
    /**
     * @notice Check risk level of a target address
     * @param target Address to check
     * @return riskLevel The risk level
     */
    function checkRiskLevel(address target) 
        public 
        view 
        returns (GhostShellRegistry.RiskLevel) 
    {
        GhostShellRegistry.SecurityManifest memory manifest = registry.getManifest(target);
        return manifest.riskLevel;
    }
    
    /**
     * @notice Get risk score for a target
     * @param target Address to check
     * @return riskScore The risk score (0-100)
     */
    function getRiskScore(address target) public view returns (uint256) {
        GhostShellRegistry.SecurityManifest memory manifest = registry.getManifest(target);
        return manifest.riskScore;
    }
}
