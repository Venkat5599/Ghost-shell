import { ethers } from "hardhat";

async function main() {
  // CONFIGURATION - Update these values after deployment
  const REGISTRY_ADDRESS = process.env.REGISTRY_ADDRESS || "YOUR_REGISTRY_ADDRESS_HERE";
  const BACKEND_WALLET = process.env.BACKEND_WALLET || "YOUR_BACKEND_WALLET_ADDRESS_HERE";

  console.log("\n🔐 Authorizing Backend Auditor...\n");

  // Get the registry contract
  const registry = await ethers.getContractAt("GhostShellRegistry", REGISTRY_ADDRESS);

  // Check if already authorized
  const isAuthorized = await registry.authorizedAuditors(BACKEND_WALLET);
  
  if (isAuthorized) {
    console.log("✅ Backend wallet is already authorized!");
    console.log("   Address:", BACKEND_WALLET);
    return;
  }

  // Authorize the backend wallet
  console.log("📝 Authorizing backend wallet:", BACKEND_WALLET);
  const tx = await registry.authorizeAuditor(BACKEND_WALLET);
  console.log("⏳ Transaction sent:", tx.hash);
  
  await tx.wait();
  console.log("✅ Backend wallet authorized successfully!");
  
  // Verify
  const nowAuthorized = await registry.authorizedAuditors(BACKEND_WALLET);
  console.log("✓ Verification:", nowAuthorized ? "AUTHORIZED" : "NOT AUTHORIZED");
  
  console.log("\n" + "=".repeat(60));
  console.log("🎉 Authorization Complete!");
  console.log("=".repeat(60));
  console.log("\nNext Steps:");
  console.log("1. Update backend .env with REGISTRY_ADDRESS");
  console.log("2. Deploy backend to Vercel");
  console.log("3. Test manifest registration");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
