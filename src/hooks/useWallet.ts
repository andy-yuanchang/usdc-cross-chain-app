import { useState } from 'react'
import type { TransactionStatus, WalletConnectionStatus } from '@/types/wallet'
import { wallets } from '@/wallets'
import { useAtom } from 'jotai'
import { walletErrorAtom } from '@/atoms/wallet'
import {
  WalletConnectionError,
  WalletSwitchChainError
} from '@/constants/errors'
import { getErrorMessage } from '@/utils'
import type { Chain, UserRejectedRequestError } from 'viem'

function getWallet(name: string) {
  return wallets.find((x) => x.name === name)
}

export default function useWallet() {
  const [error, setError] = useAtom(walletErrorAtom)
  const [connectionStatus, setConnectionStatus] =
    useState<WalletConnectionStatus>('unconnected')
  const [transactionStatus, setTransactionStatus] =
    useState<TransactionStatus | null>(null)

  const connect = async (name: string) => {
    const wallet = getWallet(name)
    if (!wallet) {
      setError(
        new Error('No wallet detected, please choose a wallet to connect')
      )
      return
    }
    try {
      setError(null)
      setConnectionStatus('connecting')
      await wallet.connect()
      setConnectionStatus('connected')
    } catch (error: any) {
      if (
        error instanceof Error &&
        (error.message.includes('User rejected the request') ||
          error.message.includes('Connection request reset. Please try again.'))
      ) {
        setConnectionStatus('user-rejected')
        return
      }
      setConnectionStatus('unconnected')
      setError(new WalletConnectionError(getErrorMessage(error)))
    }
  }

  const switchChain = async (name: string, chainId: Chain['id']) => {
    const wallet = getWallet(name)
    if (!wallet) {
      setError(
        new Error('No wallet detected, please choose a wallet to connect')
      )
      return
    }
    try {
      setError(null)
      await wallet.switchChain(chainId)
    } catch (error) {
      setError(new WalletSwitchChainError(getErrorMessage(error)))
    }
  }

  return {
    isConnected: connectionStatus === 'connected',
    cancel: () => setConnectionStatus('unconnected'),
    connectionStatus,
    connect,
    switchChain,
    transactionStatus,
    error
  }
}
