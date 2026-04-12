import dotenv from 'dotenv'

dotenv.config()

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  hashkeyChain: {
    rpcUrl: process.env.HASHKEY_CHAIN_RPC_URL || 'https://hashkey-chain-rpc.example.com',
    chainId: parseInt(process.env.HASHKEY_CHAIN_ID || '177', 10),
  },
  
  groq: {
    apiKey: process.env.GROQ_API_KEY || '',
    model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
  },
  
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
  },
  
  database: {
    url: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/ghost_shell',
  },
  
  security: {
    apiRateLimit: parseInt(process.env.API_RATE_LIMIT || '100', 10),
    cacheTtlContract: parseInt(process.env.CACHE_TTL_CONTRACT || '86400', 10),
    cacheTtlWallet: parseInt(process.env.CACHE_TTL_WALLET || '3600', 10),
  },
}
