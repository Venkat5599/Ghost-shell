import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying Ghost Shell Contracts...\n");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH\n");

  // Deploy GhostShellRegistry
  console.log("📝 Deploying GhostShellRegistry...");
  const GhostShellRegistry = await ethers.getContractFactory("GhostShellRegistry");
  const registry = await GhostShellRegistry.deploy();
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  console.log("✅ GhostShellRegistry deployed to:", registryAddress);

  // Deploy SecureVault (example)
  console.log("\n📝 Deploying SecureVault...");
  const SecureVault = await ethers.getContractFactory("SecureVault");
  const vault = await SecureVault.deploy(registryAddress);
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  console.log("✅ SecureVault deployed to:", vaultAddress);

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("🎉 Deployment Complete!");
  console.log("=".repeat(60));
  console.log("\nContract Addresses:");
  console.log("-------------------");
  console.log("GhostShellRegistry:", registryAddress);
  console.log("SecureVault:", vaultAddress);
  console.log("\nNext Steps:");
  console.log("1. Verify contracts on block explorer");
  console.log("2. Update backend config with registry address");
  console.log("3. Authorize backend auditor address");
  console.log("\nAuthorize Backend:");
  console.log(`await registry.authorizeAuditor("YOUR_BACKEND_ADDRESS")`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
