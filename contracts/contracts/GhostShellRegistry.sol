// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title GhostShellRegistry
 * @notice Central registry for security manifests and risk assessments
 * @dev Stores on-chain security audit results for transparency
 */
contract GhostShellRegistry is Ownable, ReentrancyGuard {
    
    struct SecurityManifest {
        string manifestId;
        address contractAddress;
        uint256 riskScore;
        RiskLevel riskLevel;
        uint256 timestamp;
        string ipfsHash;
        address auditor;
        bool isValid;
    }
    
    enum RiskLevel {
        SAFE,
        WARNING,
        CRITICAL
    }
    
    mapping(address => SecurityManifest) public manifests;
    mapping(string => SecurityManifest) public manifestsById;
    mapping(address => bool) public authorizedAuditors;
    
    event ManifestRegistered(
        string indexed manifestId,
        address indexed contractAddress,
        uint256 riskScore,
        RiskLevel riskLevel,
        string ipfsHash
    );
    
    event AuditorAuthorized(address indexed auditor);
    event AuditorRevoked(address indexed auditor);
    event ManifestInvalidated(string indexed manifestId);
    
    constructor() Ownable(msg.sender) {
        authorizedAuditors[msg.sender] = true;
    }
    
    function registerManifest(
        string memory manifestId,
        address contractAddress,
        uint256 riskScore,
        RiskLevel riskLevel,
        string memory ipfsHash
    ) external nonReentrant {
        require(authorizedAuditors[msg.sender], "Not authorized auditor");
        require(contractAddress != address(0), "Invalid contract address");
        require(riskScore <= 100, "Risk score must be <= 100");
        require(bytes(manifestId).length > 0, "Invalid manifest ID");
        require(bytes(ipfsHash).length > 0, "Invalid IPFS hash");
        
        SecurityManifest memory manifest = SecurityManifest({
            manifestId: manifestId,
            contractAddress: contractAddress,
            riskScore: riskScore,
            riskLevel: riskLevel,
            timestamp: block.timestamp,
            ipfsHash: ipfsHash,
            auditor: msg.sender,
            isValid: true
        });
        
        manifests[contractAddress] = manifest;
        manifestsById[manifestId] = manifest;
        
        emit ManifestRegistered(manifestId, contractAddress, riskScore, riskLevel, ipfsHash);
    }
    
    function getManifest(address contractAddress) external view returns (SecurityManifest memory) {
        return manifests[contractAddress];
    }
    
    function getManifestById(string memory manifestId) external view returns (SecurityManifest memory) {
        return manifestsById[manifestId];
    }
    
    function isSafe(address contractAddress) external view returns (bool) {
        SecurityManifest memory manifest = manifests[contractAddress];
        return manifest.isValid && manifest.riskLevel == RiskLevel.SAFE;
    }
    
    function authorizeAuditor(address auditor) external onlyOwner {
        require(auditor != address(0), "Invalid auditor address");
        authorizedAuditors[auditor] = true;
        emit AuditorAuthorized(auditor);
    }
    
    function revokeAuditor(address auditor) external onlyOwner {
        authorizedAuditors[auditor] = false;
        emit AuditorRevoked(auditor);
    }
    
    function invalidateManifest(string memory manifestId) external onlyOwner {
        SecurityManifest storage manifest = manifestsById[manifestId];
        require(manifest.timestamp > 0, "Manifest does not exist");
        manifest.isValid = false;
        manifests[manifest.contractAddress].isValid = false;
        emit ManifestInvalidated(manifestId);
    }
}
