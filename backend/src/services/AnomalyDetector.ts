import { ethers } from 'ethers';

interface AnomalyAlert {
  type: 'token_mint' | 'flash_loan' | 'governance' | 'validator' | 'suspicious_transfer';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  txHash?: string;
  address?: string;
  timestamp: number;
  details: any;
}

interface TokenSupplyChange {
  address: string;
  previousSupply: bigint;
  currentSupply: bigint;
  percentageChange: number;
}

export class AnomalyDetector {
  private provider: ethers.JsonRpcProvider;
  private alerts: AnomalyAlert[] = [];
  private tokenSupplyCache: Map<string, bigint> = new Map();
  
  // Thresholds for anomaly detection
  private readonly LARGE_MINT_THRESHOLD = 1; // 1% of total supply
  private readonly FLASH_LOAN_THRESHOLD = ethers.parseEther('1000'); // 1000 ETH
  private readonly SUSPICIOUS_TRANSFER_THRESHOLD = ethers.parseEther('100'); // 100 ETH
  
  constructor(rpcUrl: string) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
  }

  /**
   * Monitor a transaction for anomalies
   */
  async analyzeTransaction(txHash: string): Promise<AnomalyAlert[]> {
    const alerts: AnomalyAlert[] = [];
    
    try {
      const tx = await this.provider.getTransaction(txHash);
      const receipt = await this.provider.getTransactionReceipt(txHash);
      
      if (!tx || !receipt) {
        return alerts;
      }

      // Check for flash loan patterns
      const flashLoanAlert = await this.detectFlashLoan(tx, receipt);
      if (flashLoanAlert) alerts.push(flashLoanAlert);

      // Check for large transfers
      const transferAlert = await this.detectSuspiciousTransfer(tx, receipt);
      if (transferAlert) alerts.push(transferAlert);

      // Check for token minting
      const mintAlert = await this.detectLargeTokenMint(receipt);
      if (mintAlert) alerts.push(mintAlert);

    } catch (error) {
      console.error('Error analyzing transaction:', error);
    }

    return alerts;
  }

  /**
   * Detect flash loan attacks
   * Pattern: Large borrow + complex interactions + full repayment in same tx
   */
  private async detectFlashLoan(
    tx: ethers.TransactionResponse,
    receipt: ethers.TransactionReceipt
  ): Promise<AnomalyAlert | null> {
    try {
      // Check if transaction value is very large
      if (tx.value > this.FLASH_LOAN_THRESHOLD) {
        // Check for multiple contract interactions (typical flash loan pattern)
        if (receipt.logs.length > 10) {
          return {
            type: 'flash_loan',
            severity: 'high',
            description: 'Potential flash loan attack detected: Large value transfer with multiple contract interactions',
            txHash: tx.hash,
            address: tx.from,
            timestamp: Date.now(),
            details: {
              value: ethers.formatEther(tx.value),
              logCount: receipt.logs.length,
              gasUsed: receipt.gasUsed.toString()
            }
          };
        }
      }
    } catch (error) {
      console.error('Error detecting flash loan:', error);
    }
    
    return null;
  }

  /**
   * Detect suspicious large transfers
   */
  private async detectSuspiciousTransfer(
    tx: ethers.TransactionResponse,
    receipt: ethers.TransactionReceipt
  ): Promise<AnomalyAlert | null> {
    try {
      if (tx.value > this.SUSPICIOUS_TRANSFER_THRESHOLD) {
        // Check if recipient is a new address (potential rug pull)
        const recipientCode = await this.provider.getCode(tx.to || '');
        const isContract = recipientCode !== '0x';
        
        return {
          type: 'suspicious_transfer',
          severity: 'medium',
          description: `Large transfer detected: ${ethers.formatEther(tx.value)} ETH to ${isContract ? 'contract' : 'EOA'}`,
          txHash: tx.hash,
          address: tx.to || '',
          timestamp: Date.now(),
          details: {
            value: ethers.formatEther(tx.value),
            from: tx.from,
            to: tx.to,
            isContract
          }
        };
      }
    } catch (error) {
      console.error('Error detecting suspicious transfer:', error);
    }
    
    return null;
  }

  /**
   * Detect large token minting (> 1% of supply)
   * This would catch exploits like the Polkadot incident
   */
  private async detectLargeTokenMint(
    receipt: ethers.TransactionReceipt
  ): Promise<AnomalyAlert | null> {
    try {
      // Look for Transfer events from zero address (minting)
      const transferTopic = ethers.id('Transfer(address,address,uint256)');
      const zeroAddress = ethers.ZeroAddress;
      
      for (const log of receipt.logs) {
        if (log.topics[0] === transferTopic) {
          const from = ethers.getAddress('0x' + log.topics[1].slice(26));
          
          // Check if it's a mint (from zero address)
          if (from === zeroAddress) {
            const tokenAddress = log.address;
            const amount = BigInt(log.data);
            
            // Get total supply
            const tokenContract = new ethers.Contract(
              tokenAddress,
              ['function totalSupply() view returns (uint256)'],
              this.provider
            );
            
            try {
              const totalSupply = await tokenContract.totalSupply();
              const percentageOfSupply = (Number(amount) / Number(totalSupply)) * 100;
              
              // Alert if mint is > 1% of total supply
              if (percentageOfSupply > this.LARGE_MINT_THRESHOLD) {
                return {
                  type: 'token_mint',
                  severity: percentageOfSupply > 10 ? 'critical' : 'high',
                  description: `Large token mint detected: ${percentageOfSupply.toFixed(2)}% of total supply`,
                  txHash: receipt.hash,
                  address: tokenAddress,
                  timestamp: Date.now(),
                  details: {
                    tokenAddress,
                    amountMinted: amount.toString(),
                    totalSupply: totalSupply.toString(),
                    percentageOfSupply: percentageOfSupply.toFixed(2)
                  }
                };
              }
            } catch (error) {
              // Token might not have totalSupply function
              console.log('Could not get total supply for token:', tokenAddress);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error detecting token mint:', error);
    }
    
    return null;
  }

  /**
   * Monitor a contract address for anomalies
   */
  async monitorContract(contractAddress: string): Promise<AnomalyAlert[]> {
    const alerts: AnomalyAlert[] = [];
    
    try {
      // Get recent transactions for this contract
      const currentBlock = await this.provider.getBlockNumber();
      const fromBlock = currentBlock - 100; // Last 100 blocks
      
      // Check for unusual activity patterns
      const code = await this.provider.getCode(contractAddress);
      
      if (code === '0x') {
        alerts.push({
          type: 'governance',
          severity: 'high',
          description: 'Contract has no code - possible self-destruct or upgrade',
          address: contractAddress,
          timestamp: Date.now(),
          details: { contractAddress }
        });
      }
      
    } catch (error) {
      console.error('Error monitoring contract:', error);
    }
    
    return alerts;
  }

  /**
   * Get all alerts
   */
  getAlerts(): AnomalyAlert[] {
    return this.alerts;
  }

  /**
   * Clear old alerts (older than 24 hours)
   */
  clearOldAlerts(): void {
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    this.alerts = this.alerts.filter(alert => alert.timestamp > oneDayAgo);
  }

  /**
   * Analyze wallet for suspicious patterns
   */
  async analyzeWalletBehavior(walletAddress: string): Promise<AnomalyAlert[]> {
    const alerts: AnomalyAlert[] = [];
    
    try {
      // Get transaction count
      const txCount = await this.provider.getTransactionCount(walletAddress);
      
      // Check if it's a new wallet with large transactions (suspicious)
      if (txCount < 5) {
        const balance = await this.provider.getBalance(walletAddress);
        
        if (balance > ethers.parseEther('10')) {
          alerts.push({
            type: 'suspicious_transfer',
            severity: 'medium',
            description: 'New wallet with large balance - potential exploit preparation',
            address: walletAddress,
            timestamp: Date.now(),
            details: {
              txCount,
              balance: ethers.formatEther(balance)
            }
          });
        }
      }
      
    } catch (error) {
      console.error('Error analyzing wallet behavior:', error);
    }
    
    return alerts;
  }
}

export default AnomalyDetector;
