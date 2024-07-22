import { errorAtom } from '@/atoms/common'
import { createStore } from 'jotai'
import { addressAtom, currentChainAtom } from './wallet'

export const walletStore = createStore()
walletStore.set(addressAtom, null)
walletStore.set(currentChainAtom, null)

export const globalStore = createStore()
globalStore.set(errorAtom, null)
