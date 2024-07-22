import { SupportedWallets } from '@/types/wallet'
import { atom } from 'jotai'
import type { WalletClient, Address, Chain } from 'viem'

export const walletClientAtom = atom<WalletClient | null>(null)

export const addressAtom = atom<Address | null>(null)

export const currentChainAtom = atom<Chain | null | undefined>(null)

export const selectedWalletAtom = atom<SupportedWallets | null>(null)

export const walletErrorAtom = atom<Error | null>(null)
