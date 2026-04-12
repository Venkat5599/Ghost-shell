import { createConfig, http } from 'wagmi'
import { defineChain } from 'viem'

// Define HashKey Chain Testnet
export const hashkeyTestnet = defineChain({
  id: 133,
  name: 'HashKey Chain Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'HSK',
    symbol: 'HSK',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet.hsk.xyz'],
    },
    public: {
      http: ['https://testnet.hsk.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'HashKey Explorer',
      url: 'https://testnet-explorer.hsk.xyz',
    },
  },
  testnet: true,
})

// Define HashKey Chain Mainnet
export const hashkeyMainnet = defineChain({
  id: 177,
  name: 'HashKey Chain',
  nativeCurrency: {
    decimals: 18,
    name: 'HSK',
    symbol: 'HSK',
  },
  rpcUrls: {
    default: {
      http: ['https://mainnet.hsk.xyz'],
    },
    public: {
      http: ['https://mainnet.hsk.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'HashKey Explorer',
      url: 'https://hashkey.blockscout.com',
    },
  },
})

export const config = createConfig({
  chains: [hashkeyTestnet, hashkeyMainnet],
  transports: {
    [hashkeyTestnet.id]: http(),
    [hashkeyMainnet.id]: http(),
  },
})
