import { ethers } from "hardhat";

async function main() {
  console.log("🔐 Authorizing Backend Wallet...\n");

  // Configuration
  const REGISTRY_ADDRESS = "0x2CD70324C4043D90f3C45D6ac7E84aB828708205";
  const BACKEND_WALLET = process.env.BACKEND_WALLET_ADDRESS || "";

  if (!BACKEND_WALLET) {
    console.error("❌ Error: BACKEND_WALLET_ADDRESS not set");
    console.log("\nUsage:");
    console.log("BACKEND_WALLET_ADDRESS=0x... npx hardhat run scripts/authorize-backend.ts --network hashkeyTestnet");
    process.exit(1);
  }

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Authorizing with account:", deployer.address);
  console.log("Backend wallet to authorize:", BACKEND_WALLET);

  // Get registry contract
  const registry = await ethers.getContractAt("GhostShellRegistry", REGISTRY_ADDRESS);

  // Check if already authorized
  const isAuthorized = await registry.isAuthorizedAuditor(BACKEND_WALLET);
  if (isAuthorized) {
    console.log("\n✅ Backend wallet is already authorized!");
    return;
  }

  // Authorize
  console.log("\n📝 Authorizing backend wallet...");
  const tx = await registry.authorizeAuditor(BACKEND_WALLET);
  console.log("Transaction hash:", tx.hash);
  
  console.log("⏳ Waiting for confirmation...");
  await tx.wait();

  // Verify
  const nowAuthorized = await registry.isAuthorizedAuditor(BACKEND_WALLET);
  
  if (nowAuthorized) {
    console.log("\n✅ Success! Backend wallet authorized!");
    console.log("\nNext steps:");
    console.log("1. Deploy backend to Vercel");
    console.log("2. Add environment variables");
    console.log("3. Test API endpoints");
  } else {
    console.log("\n❌ Authorization failed. Please try again.");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
