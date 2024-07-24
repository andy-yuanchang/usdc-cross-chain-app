import { TransactionStatus } from '@/types/wallet'
import { atom } from 'jotai'

export const transactionAtom = atom<TransactionStatus | null>(null)

export const transactionErrorAtom = atom<Error | null>(null)
