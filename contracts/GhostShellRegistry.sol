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
        string ipfsHash; // IPFS hash of full manifest JSON
        address auditor;
        bool isValid;
    }
    
    enum RiskLevel {
        SAFE,
        WARNING,
        CRITICAL
    }
    
    // Mapping: contract address => latest manifest
    mapping(address => SecurityManifest) public manifests;
    
    // Mapping: manifestId => manifest
    mapping(string => SecurityManifest) public manifestsById;
    
    // Mapping: auditor address => authorized
    mapping(address => bool) public authorizedAuditors;
    
    // Events
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
        // Owner is automatically an authorized auditor
        authorizedAuditors[msg.sender] = true;
    }
    
    /**
     * @notice Register a new security manifest
     * @param manifestId Unique manifest identifier
     * @param contractAddress Address of the audited contract
     * @param riskScore Risk score (0-100)
     * @param riskLevel Risk level enum
     * @param ipfsHash IPFS hash of the full manifest
     */
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
        
        emit ManifestRegistered(
            manifestId,
            contractAddress,
            riskScore,
            riskLevel,
            ipfsHash
        );
    }
    
    /**
     * @notice Get the latest manifest for a contract
     * @param contractAddress Address to query
     * @return manifest The security manifest
     */
    function getManifest(address contractAddress) 
        external 
        view 
        returns (SecurityManifest memory) 
    {
        return manifests[contractAddress];
    }
    
    /**
     * @notice Get manifest by ID
     * @param manifestId Manifest identifier
     * @return manifest The security manifest
     */
    function getManifestById(string memory manifestId) 
        external 
        view 
        returns (SecurityManifest memory) 
    {
        return manifestsById[manifestId];
    }
    
    /**
     * @notice Check if a contract is safe to interact with
     * @param contractAddress Address to check
     * @return isSafe True if risk level is SAFE
     */
    function isSafe(address contractAddress) external view returns (bool) {
        SecurityManifest memory manifest = manifests[contractAddress];
        return manifest.isValid && manifest.riskLevel == RiskLevel.SAFE;
    }
    
    /**
     * @notice Authorize a new auditor
     * @param auditor Address to authorize
     */
    function authorizeAuditor(address auditor) external onlyOwner {
        require(auditor != address(0), "Invalid auditor address");
        authorizedAuditors[auditor] = true;
        emit AuditorAuthorized(auditor);
    }
    
    /**
     * @notice Revoke auditor authorization
     * @param auditor Address to revoke
     */
    function revokeAuditor(address auditor) external onlyOwner {
        authorizedAuditors[auditor] = false;
        emit AuditorRevoked(auditor);
    }
    
    /**
     * @notice Invalidate a manifest (e.g., if audit was incorrect)
     * @param manifestId Manifest to invalidate
     */
    function invalidateManifest(string memory manifestId) external onlyOwner {
        SecurityManifest storage manifest = manifestsById[manifestId];
        require(manifest.timestamp > 0, "Manifest does not exist");
        manifest.isValid = false;
        
        // Also invalidate in the contract mapping
        manifests[manifest.contractAddress].isValid = false;
        
        emit ManifestInvalidated(manifestId);
    }
}
