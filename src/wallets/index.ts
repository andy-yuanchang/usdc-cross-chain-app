import type { Wallets } from '@/types/wallet'
import { metaMask } from './metaMask'
import { walletConnect } from './walletConnect'

export const wallets: Wallets[] = [metaMask, walletConnect]
