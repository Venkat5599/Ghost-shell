// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./GhostShellRegistry.sol";

abstract contract GhostShellGuard {
    GhostShellRegistry public immutable registry;
    
    event TransactionBlocked(address indexed user, address indexed target, string reason);
    event RiskWarning(address indexed user, address indexed target, uint256 riskScore);
    
    constructor(address _registry) {
        require(_registry != address(0), "Invalid registry address");
        registry = GhostShellRegistry(_registry);
    }
    
    modifier ghostShellProtected(address target) {
        _checkSecurity(target);
        _;
    }
    
    function _checkSecurity(address target) internal view {
        GhostShellRegistry.SecurityManifest memory manifest = registry.getManifest(target);
        
        if (manifest.timestamp == 0) {
            return;
        }
        
        require(
            manifest.riskLevel != GhostShellRegistry.RiskLevel.CRITICAL,
            "Ghost Shell: CRITICAL RISK - Transaction blocked"
        );
        
        // Note: Cannot emit in view function
        // Warning level contracts are allowed but can be checked via getRiskScore()
    }
    
    function checkRiskLevel(address target) public view returns (GhostShellRegistry.RiskLevel) {
        GhostShellRegistry.SecurityManifest memory manifest = registry.getManifest(target);
        return manifest.riskLevel;
    }
    
    function getRiskScore(address target) public view returns (uint256) {
        GhostShellRegistry.SecurityManifest memory manifest = registry.getManifest(target);
        return manifest.riskScore;
    }
}
