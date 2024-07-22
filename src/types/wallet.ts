import { SUPPORTED_CHAINS, SUPPORTED_WALLETS } from '@/constants'
import type { Chain } from 'viem'

export type SupportedWallets = typeof SUPPORTED_WALLETS[number]['name']

export interface Wallets {
  name: SupportedWallets  
  connect: () => Promise<void>
  switchChain: (id: Chain['id']) => Promise<void>
  init: () => Promise<void>
}

export type SupportedChains = typeof SUPPORTED_CHAINS[number]['name']

export type TransactionStatus = 'pending' | 'confirmed' | 'error';

export type WalletConnectionStatus = 'unconnected' | 'connecting' | 'connected' | 'user-rejected'