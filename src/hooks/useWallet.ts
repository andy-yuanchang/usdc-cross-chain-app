import { walletStore } from '@/atoms/store'
import { addressAtom, currentChainAtom, walletErrorAtom } from '@/atoms/wallet'
import {
  WalletConnectionError,
  WalletSwitchChainError
} from '@/constants/errors'
import type { WalletConnectionStatus } from '@/types/wallet'
import { getErrorMessage, getWallet } from '@/utils'
import { useAtom, useAtomValue } from 'jotai'
import { useEffect, useState } from 'react'
import type { Chain } from 'viem'

export default function useWallet() {
  const address = useAtomValue(addressAtom)
  const [error, setError] = useAtom(walletErrorAtom)
  const [connectionStatus, setConnectionStatus] =
    useState<WalletConnectionStatus>('disconnected')

  useEffect(() => {
    if (address) {
      setConnectionStatus('connected')
    }
    return () => {
      setConnectionStatus('disconnected')
    }
  }, [address])

  const connect = async (walletName: string) => {
    const wallet = getWallet(walletName)
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
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        (error.message.includes('User rejected the request') ||
          error.message.includes('Connection request reset. Please try again.'))
      ) {
        setConnectionStatus('user-rejected')
        return
      }
      setConnectionStatus('disconnected')
      setError(new WalletConnectionError(getErrorMessage(error)))
    }
  }

  const switchChain = async (walletName: string, chainId: Chain['id']) => {
    const wallet = getWallet(walletName)
    if (!wallet) {
      setError(
        new Error('No wallet detected, please choose a wallet to connect')
      )
      return
    }
    try {
      setError(null)
      await wallet.switchChain(chainId)
      walletStore.set(currentChainAtom, chainId)
    } catch (error) {
      console.log(error)
      setError(new WalletSwitchChainError(getErrorMessage(error)))
    }
  }

  return {
    isConnected: connectionStatus === 'connected',
    cancel: () => setConnectionStatus('disconnected'),
    connectionStatus,
    connect,
    switchChain,
    error
  }
}
