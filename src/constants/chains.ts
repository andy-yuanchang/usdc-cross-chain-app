import { sepolia } from 'viem/chains'
import { defineChain } from 'viem'

const solanaTestnet = defineChain({
  id: 0, // Since Solana is not EVM-compatible, choose an arbitrary ID not used by EVM chains
  name: 'Solana Testnet',
  network: 'solana-testnet',
  nativeCurrency: {
    name: 'Sol',
    symbol: 'SOL',
    decimals: 9
  },
  rpcUrls: {
    default: {
      http: ['https://api.testnet.solana.com'],
      webSocket: ['wss://api.testnet.solana.com']
    },
    public: {
      http: ['https://api.testnet.solana.com'],
      webSocket: ['wss://api.testnet.solana.com']
    }
  },
  blockExplorers: {
    default: {
      name: 'Solana Explorer',
      url: 'https://explorer.solana.com/?cluster=testnet'
    }
  },
  testnet: true
})

export const customChains = { solanaTestnet }

export const SUPPORTED_CHAINS = [sepolia, ...Object.values(customChains)]

export const DEFAULT_CHAIN = sepolia
