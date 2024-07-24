import {
  sepolia,
  avalancheFuji,
  optimismSepolia,
  arbitrumSepolia,
  baseSepolia,
  polygonAmoy
} from 'viem/chains'
import { defineChain } from 'viem'
import type { SupportedChainIds } from '@/types/wallet'

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

export const SUPPORTED_CHAINS_DETAILS = [
  sepolia,
  avalancheFuji,
  optimismSepolia,
  arbitrumSepolia,
  baseSepolia,
  polygonAmoy,
  ...Object.values(customChains)
]

export const DEFAULT_CHAIN = sepolia

export const IMAGE_PATHS: Record<SupportedChainIds, string> = {
  '0': 'solana-sol-logo.svg',
  '43113': 'avalanche-avax-logo.svg',
  '11155420': 'optimism-ethereum-op-logo.svg',
  '421614': 'arbitrum-arb-logo.svg',
  '84532': 'https://www.cctp.io/8453.svg',
  '80002': 'polygon-matic-logo.svg',
  '11155111': 'https://www.ethereum-ecosystem.com/logo.webp'
} as const

export const CCTP_DOMAIN_ID: Record<SupportedChainIds, string> = {
  '0': '5',
  '43113': '1',
  '11155420': '2',
  '421614': '3',
  '84532': '6',
  '80002': '7',
  '11155111': '0'
}
