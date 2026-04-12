/**
 * Local Testing Script for Backend API
 * Run with: npx tsx test-local.ts
 */

import { ContractScanner } from './src/services/ContractScanner'
import { WalletAnalyzer } from './src/services/WalletAnalyzer'
import { AIExplanationService } from './src/services/AIExplanationService'
import { RiskAggregator } from './src/services/RiskAggregator'

async function testContractScanner() {
  console.log('\n🔍 Testing Contract Scanner...\n')
  
  try {
    const scanner = new ContractScanner()
    const aiService = new AIExplanationService()
    
    // Test with deployed registry contract
    const contractAddress = '0x2CD70324C4043D90f3C45D6ac7E84aB828708205'
    console.log(`Scanning contract: ${contractAddress}`)
    
    const result = await scanner.scanByAddress(contractAddress)
    console.log('\n✅ Scan Result:')
    console.log(`- Risk Score: ${result.riskScore}/100`)
    console.log(`- Issues Found: ${result.issues.length}`)
    console.log(`- Manifest Hash: ${result.manifest.manifestHash}`)
    
    if (result.issues.length > 0) {
      console.log('\n📋 Issues:')
      result.issues.forEach((issue, i) => {
        console.log(`  ${i + 1}. [${issue.severity}] ${issue.title}`)
      })
      
      // Test AI explanation
      console.log('\n🤖 Generating AI Explanation...')
      const explanation = await aiService.explainVulnerabilities(result.issues)
      console.log(`✅ AI Explanation: ${explanation.substring(0, 200)}...`)
    }
    
    return true
  } catch (error) {
    console.error('❌ Contract Scanner Error:', error)
    return false
  }
}

async function testWalletAnalyzer() {
  console.log('\n👛 Testing Wallet Analyzer...\n')
  
  try {
    const analyzer = new WalletAnalyzer()
    
    // Test with deployer wallet
    const walletAddress = '0x1E0048D83ba01D823dc852cfabeb94fC76B089B7'
    console.log(`Analyzing wallet: ${walletAddress}`)
    
    const result = await analyzer.analyzeWallet(walletAddress)
    console.log('\n✅ Analysis Result:')
    console.log(`- Risk Score: ${result.riskScore}/100`)
    console.log(`- Risk Level: ${result.riskLevel}`)
    console.log(`- Transaction Count: ${result.transactionCount}`)
    console.log(`- Balance: ${result.balance} ETH`)
    
    if (result.factors.length > 0) {
      console.log('\n🚩 Risk Factors:')
      result.factors.forEach((factor, i) => {
        console.log(`  ${i + 1}. [${factor.severity}] ${factor.description}`)
      })
    }
    
    return true
  } catch (error) {
    console.error('❌ Wallet Analyzer Error:', error)
    return false
  }
}

async function testRiskAggregator() {
  console.log('\n⚖️ Testing Risk Aggregator...\n')
  
  try {
    const aggregator = new RiskAggregator()
    
    const contractAddress = '0x2CD70324C4043D90f3C45D6ac7E84aB828708205'
    const walletAddress = '0x1E0048D83ba01D823dc852cfabeb94fC76B089B7'
    
    console.log('Performing comprehensive risk check...')
    const result = await aggregator.performRiskCheck(contractAddress, walletAddress)
    
    console.log('\n✅ Risk Check Result:')
    console.log(`- Overall Risk: ${result.overallRisk}/100`)
    console.log(`- Risk Level: ${result.riskLevel}`)
    console.log(`- Recommendation: ${result.recommendation}`)
    console.log(`- Contract Risk: ${result.contractRisk}/100`)
    console.log(`- Wallet Risk: ${result.walletRisk}/100`)
    
    if (result.warnings.length > 0) {
      console.log('\n⚠️ Warnings:')
      result.warnings.forEach((warning, i) => {
        console.log(`  ${i + 1}. ${warning}`)
      })
    }
    
    return true
  } catch (error) {
    console.error('❌ Risk Aggregator Error:', error)
    return false
  }
}

async function testAIService() {
  console.log('\n🤖 Testing AI Service...\n')
  
  try {
    const aiService = new AIExplanationService()
    
    const testIssues = [
      {
        severity: 'high' as const,
        title: 'Reentrancy Vulnerability',
        description: 'Contract may be vulnerable to reentrancy attacks',
        location: 'withdraw function',
        recommendation: 'Use ReentrancyGuard or checks-effects-interactions pattern'
      }
    ]
    
    console.log('Generating AI explanation for test vulnerability...')
    const explanation = await aiService.explainVulnerabilities(testIssues)
    console.log('\n✅ AI Explanation Generated:')
    console.log(explanation.substring(0, 300) + '...')
    
    console.log('\n🎯 Generating attack scenarios...')
    const scenarios = await aiService.generateAttackScenarios(testIssues)
    console.log('\n✅ Attack Scenarios Generated:')
    console.log(JSON.stringify(scenarios).substring(0, 300) + '...')
    
    return true
  } catch (error) {
    console.error('❌ AI Service Error:', error)
    return false
  }
}

async function runAllTests() {
  console.log('═══════════════════════════════════════════════════')
  console.log('🛡️  Ghost Shell Backend - Local Testing')
  console.log('═══════════════════════════════════════════════════')
  
  const results = {
    contractScanner: false,
    walletAnalyzer: false,
    riskAggregator: false,
    aiService: false
  }
  
  // Run tests
  results.contractScanner = await testContractScanner()
  results.walletAnalyzer = await testWalletAnalyzer()
  results.riskAggregator = await testRiskAggregator()
  results.aiService = await testAIService()
  
  // Summary
  console.log('\n═══════════════════════════════════════════════════')
  console.log('📊 Test Summary')
  console.log('═══════════════════════════════════════════════════')
  console.log(`Contract Scanner: ${results.contractScanner ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`Wallet Analyzer:  ${results.walletAnalyzer ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`Risk Aggregator:  ${results.riskAggregator ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`AI Service:       ${results.aiService ? '✅ PASS' : '❌ FAIL'}`)
  
  const allPassed = Object.values(results).every(r => r)
  console.log('\n' + (allPassed ? '🎉 All tests passed!' : '⚠️ Some tests failed'))
  console.log('═══════════════════════════════════════════════════\n')
  
  process.exit(allPassed ? 0 : 1)
}

// Run tests
runAllTests().catch(console.error)
