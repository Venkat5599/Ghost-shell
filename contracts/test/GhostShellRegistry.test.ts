import { expect } from "chai";
import { ethers } from "hardhat";
import { GhostShellRegistry } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("GhostShellRegistry", function () {
  let registry: GhostShellRegistry;
  let owner: SignerWithAddress;
  let auditor: SignerWithAddress;
  let user: SignerWithAddress;

  beforeEach(async function () {
    [owner, auditor, user] = await ethers.getSigners();

    const GhostShellRegistry = await ethers.getContractFactory("GhostShellRegistry");
    registry = await GhostShellRegistry.deploy();
    await registry.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await registry.owner()).to.equal(owner.address);
    });

    it("Should authorize owner as auditor", async function () {
      expect(await registry.authorizedAuditors(owner.address)).to.be.true;
    });
  });

  describe("Auditor Management", function () {
    it("Should allow owner to authorize auditor", async function () {
      await registry.authorizeAuditor(auditor.address);
      expect(await registry.authorizedAuditors(auditor.address)).to.be.true;
    });

    it("Should emit AuditorAuthorized event", async function () {
      await expect(registry.authorizeAuditor(auditor.address))
        .to.emit(registry, "AuditorAuthorized")
        .withArgs(auditor.address);
    });

    it("Should allow owner to revoke auditor", async function () {
      await registry.authorizeAuditor(auditor.address);
      await registry.revokeAuditor(auditor.address);
      expect(await registry.authorizedAuditors(auditor.address)).to.be.false;
    });

    it("Should not allow non-owner to authorize auditor", async function () {
      await expect(
        registry.connect(user).authorizeAuditor(auditor.address)
      ).to.be.revertedWithCustomError(registry, "OwnableUnauthorizedAccount");
    });
  });

  describe("Manifest Registration", function () {
    beforeEach(async function () {
      await registry.authorizeAuditor(auditor.address);
    });

    it("Should allow authorized auditor to register manifest", async function () {
      const manifestId = "test-manifest-001";
      const contractAddress = user.address;
      const riskScore = 50;
      const riskLevel = 1; // WARNING
      const ipfsHash = "QmTest123";

      await expect(
        registry.connect(auditor).registerManifest(
          manifestId,
          contractAddress,
          riskScore,
          riskLevel,
          ipfsHash
        )
      ).to.emit(registry, "ManifestRegistered");
    });

    it("Should not allow unauthorized user to register manifest", async function () {
      await expect(
        registry.connect(user).registerManifest(
          "test",
          user.address,
          50,
          1,
          "QmTest"
        )
      ).to.be.revertedWith("Not authorized auditor");
    });

    it("Should reject invalid risk score", async function () {
      await expect(
        registry.connect(auditor).registerManifest(
          "test",
          user.address,
          101, // Invalid: > 100
          1,
          "QmTest"
        )
      ).to.be.revertedWith("Risk score must be <= 100");
    });

    it("Should store manifest correctly", async function () {
      const manifestId = "test-manifest-002";
      const contractAddress = user.address;
      const riskScore = 75;
      const riskLevel = 2; // CRITICAL
      const ipfsHash = "QmTest456";

      await registry.connect(auditor).registerManifest(
        manifestId,
        contractAddress,
        riskScore,
        riskLevel,
        ipfsHash
      );

      const manifest = await registry.getManifest(contractAddress);
      expect(manifest.manifestId).to.equal(manifestId);
      expect(manifest.riskScore).to.equal(riskScore);
      expect(manifest.riskLevel).to.equal(riskLevel);
      expect(manifest.ipfsHash).to.equal(ipfsHash);
      expect(manifest.auditor).to.equal(auditor.address);
      expect(manifest.isValid).to.be.true;
    });
  });

  describe("Safety Checks", function () {
    beforeEach(async function () {
      await registry.authorizeAuditor(auditor.address);
    });

    it("Should return true for safe contracts", async function () {
      await registry.connect(auditor).registerManifest(
        "safe-contract",
        user.address,
        20,
        0, // SAFE
        "QmSafe"
      );

      expect(await registry.isSafe(user.address)).to.be.true;
    });

    it("Should return false for critical contracts", async function () {
      await registry.connect(auditor).registerManifest(
        "critical-contract",
        user.address,
        85,
        2, // CRITICAL
        "QmCritical"
      );

      expect(await registry.isSafe(user.address)).to.be.false;
    });

    it("Should return false for invalidated manifests", async function () {
      const manifestId = "to-invalidate";
      await registry.connect(auditor).registerManifest(
        manifestId,
        user.address,
        20,
        0,
        "QmTest"
      );

      await registry.invalidateManifest(manifestId);
      expect(await registry.isSafe(user.address)).to.be.false;
    });
  });
});
