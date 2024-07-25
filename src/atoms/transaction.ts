import type { TransactionStatus, ApprovalStatus } from '@/types/wallet'
import { atom } from 'jotai'

export const transactionAtom = atom<TransactionStatus | null>(null)

export const transactionErrorAtom = atom<Error | null>(null)

export const approvalStatusAtom = atom<ApprovalStatus | null>(null)
