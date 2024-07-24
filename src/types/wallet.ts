import { SUPPORTED_CHAINS_DETAILS, SUPPORTED_WALLETS } from '@/constants'
import type { Chain, createWalletClient } from 'viem'

export type SupportedWallets = (typeof SUPPORTED_WALLETS)[number]['name']

export interface Wallets {
  name: SupportedWallets
  client: ReturnType<typeof createWalletClient>
  connect: () => Promise<void>
  switchChain: (id: Chain['id']) => Promise<void>
  init: () => Promise<void>
}

export type SupportedChains = (typeof SUPPORTED_CHAINS_DETAILS)[number]['name']

export type SupportedChainIds = (typeof SUPPORTED_CHAINS_DETAILS)[number]['id']

export type TransactionStatus = 'pending' | 'confirmed' | 'error'

export type WalletConnectionStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'user-rejected'
