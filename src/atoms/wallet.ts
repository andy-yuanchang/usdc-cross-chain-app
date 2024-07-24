import { SupportedWallets } from '@/types/wallet'
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import type { WalletClient, Address } from 'viem'

export const walletClientAtom = atom<WalletClient | null>(null)

export const addressAtom = atom<Address | null>(null)

export const currentChainAtom = atomWithStorage<number | null>(
  'currentChain',
  null,
  undefined,
  { getOnInit: true }
)

export const selectedWalletAtom = atomWithStorage<SupportedWallets | null>(
  'selectedWallet',
  'Meta Mask',
  undefined,
  { getOnInit: true }
)

export const walletErrorAtom = atom<Error | null>(null)
