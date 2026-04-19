import { ethers } from 'hardhat'

async function main() {
  console.log('\n🚨 DEPLOYING VULNERABLE CONTRACT FOR DEMO 🚨')
  console.log('=' .repeat(60))
  console.log('⚠️  WARNING: This contract is DELIBERATELY VULNERABLE')
  console.log('⚠️  FOR DEMONSTRATION PURPOSES ONLY')
  console.log('⚠️  DO NOT SEND REAL FUNDS TO THIS CONTRACT')
  console.log('=' .repeat(60))

  const [deployer] = await ethers.getSigners()
  console.log('\n📍 Deploying from:', deployer.address)

  const balance = await ethers.provider.getBalance(deployer.address)
  console.log('💰 Balance:', ethers.formatEther(balance), 'HSK')

  // Deploy VulnerableContract
  console.log('\n🔨 Deploying VulnerableContract...')
  const VulnerableContract = await ethers.getContractFactory('VulnerableContract')
  const vulnerable = await VulnerableContract.deploy()
  await vulnerable.waitForDeployment()

  const vulnerableAddress = await vulnerable.getAddress()
  console.log('✅ VulnerableContract deployed to:', vulnerableAddress)

  // Verify deployment
  const code = await ethers.provider.getCode(vulnerableAddress)
  console.log('📝 Contract bytecode length:', code.length)

  console.log('\n' + '='.repeat(60))
  console.log('🎯 DEPLOYMENT COMPLETE')
  console.log('='.repeat(60))
  console.log('\n📋 Contract Address:')
  console.log('   ', vulnerableAddress)
  console.log('\n🔗 View on Explorer:')
  console.log('   ', `https://testnet-explorer.hsk.xyz/address/${vulnerableAddress}`)
  console.log('\n🧪 Test with Ghost Shell:')
  console.log('   ', '1. Go to http://localhost:3000/send')
  console.log('   ', '2. Enter recipient:', vulnerableAddress)
  console.log('   ', '3. Click "Send Transaction"')
  console.log('   ', '4. Watch Ghost Shell BLOCK the transaction!')
  console.log('\n⚠️  Expected Risk Score: 90-100 (CRITICAL)')
  console.log('⚠️  Expected Action: TRANSACTION BLOCKED')
  console.log('\n' + '='.repeat(60))

  // Save deployment info
  const fs = require('fs')
  const deploymentInfo = {
    network: 'HashKey Chain Testnet',
    chainId: 133,
    vulnerableContract: vulnerableAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    explorerUrl: `https://testnet-explorer.hsk.xyz/address/${vulnerableAddress}`,
    vulnerabilities: [
      'Reentrancy',
      'Missing Access Control',
      'Dangerous Delegatecall',
      'Unchecked External Calls',
      'tx.origin Authentication',
    ],
    expectedRiskScore: '90-100',
    expectedAction: 'BLOCKED',
  }

  fs.writeFileSync(
    'VULNERABLE_CONTRACT_ADDRESS.json',
    JSON.stringify(deploymentInfo, null, 2)
  )
  console.log('💾 Deployment info saved to: VULNERABLE_CONTRACT_ADDRESS.json\n')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
