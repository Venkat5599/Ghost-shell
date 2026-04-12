import { ethers } from "hardhat";

async function main() {
  const REGISTRY_ADDRESS = process.env.REGISTRY_ADDRESS || "YOUR_REGISTRY_ADDRESS_HERE";

  console.log("\n🧪 Testing Manifest Registration...\n");

  const [signer] = await ethers.getSigners();
  console.log("Using account:", signer.address);

  const registry = await ethers.getContractAt("GhostShellRegistry", REGISTRY_ADDRESS);

  // Check if authorized
  const isAuthorized = await registry.authorizedAuditors(signer.address);
  console.log("Is authorized:", isAuthorized);

  if (!isAuthorized) {
    console.log("❌ Not authorized! Run authorize-auditor script first.");
    return;
  }

  // Register a test manifest
  const testContract = "0x1234567890123456789012345678901234567890";
  const manifestId = `test-${Date.now()}`;
  const riskScore = 50;
  const riskLevel = 1; // WARNING
  const ipfsHash = "QmTest123456789";

  console.log("\n📝 Registering test manifest...");
  console.log("   Contract:", testContract);
  console.log("   Risk Score:", riskScore);
  console.log("   Risk Level:", riskLevel === 0 ? "SAFE" : riskLevel === 1 ? "WARNING" : "CRITICAL");

  const tx = await registry.registerManifest(
    manifestId,
    testContract,
    riskScore,
    riskLevel,
    ipfsHash
  );

  console.log("⏳ Transaction sent:", tx.hash);
  await tx.wait();
  console.log("✅ Manifest registered!");

  // Query the manifest
  console.log("\n🔍 Querying manifest...");
  const manifest = await registry.getManifest(testContract);
  
  console.log("\nManifest Details:");
  console.log("   ID:", manifest.manifestId);
  console.log("   Contract:", manifest.contractAddress);
  console.log("   Risk Score:", manifest.riskScore.toString());
  console.log("   Risk Level:", manifest.riskLevel === 0n ? "SAFE" : manifest.riskLevel === 1n ? "WARNING" : "CRITICAL");
  console.log("   IPFS Hash:", manifest.ipfsHash);
  console.log("   Auditor:", manifest.auditor);
  console.log("   Valid:", manifest.isValid);
  console.log("   Timestamp:", new Date(Number(manifest.timestamp) * 1000).toISOString());

  // Check safety
  const isSafe = await registry.isSafe(testContract);
  console.log("\n🛡️ Is Safe:", isSafe);

  console.log("\n" + "=".repeat(60));
  console.log("✅ Test Complete!");
  console.log("=".repeat(60));
  console.log("\nYour registry is working correctly!");
  console.log("Backend can now register manifests using the same process.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
