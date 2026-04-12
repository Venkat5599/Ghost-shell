import Redis from 'ioredis'
import { config } from '../config'
import { ScanResult, WalletRiskReport } from '../types'

export class CacheService {
  private redis: Redis

  constructor() {
    this.redis = new Redis({
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password,
    })

    this.redis.on('error', (err) => {
      console.error('Redis connection error:', err)
    })
  }

  async getCachedContractScan(address: string): Promise<ScanResult | null> {
    try {
      const cached = await this.redis.get(`contract:${address}`)
      if (!cached) return null

      const result = JSON.parse(cached) as ScanResult
      result.cacheHit = true
      return result
    } catch (error) {
      console.error('Cache get error:', error)
      return null
    }
  }

  async cacheContractScan(address: string, result: ScanResult): Promise<void> {
    try {
      await this.redis.setex(
        `contract:${address}`,
        config.security.cacheTtlContract,
        JSON.stringify(result)
      )
    } catch (error) {
      console.error('Cache set error:', error)
    }
  }

  async getCachedWalletAnalysis(address: string): Promise<WalletRiskReport | null> {
    try {
      const cached = await this.redis.get(`wallet:${address}`)
      if (!cached) return null

      return JSON.parse(cached) as WalletRiskReport
    } catch (error) {
      console.error('Cache get error:', error)
      return null
    }
  }

  async cacheWalletAnalysis(address: string, report: WalletRiskReport): Promise<void> {
    try {
      await this.redis.setex(
        `wallet:${address}`,
        config.security.cacheTtlWallet,
        JSON.stringify(report)
      )
    } catch (error) {
      console.error('Cache set error:', error)
    }
  }

  async close(): Promise<void> {
    await this.redis.quit()
  }
}
