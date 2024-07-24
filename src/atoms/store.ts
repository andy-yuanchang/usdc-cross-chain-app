import { errorAtom } from '@/atoms/common'
import { createStore } from 'jotai'
import { addressAtom } from './wallet'

/**
 * Wallet Store has serveral atoms
 * - addressAtom
 * - currentChainAtom, don't initialize it here, since it's a persistent value from local storage
 */
export const walletStore = createStore()
walletStore.set(addressAtom, null)

export const globalStore = createStore()
globalStore.set(errorAtom, null)
