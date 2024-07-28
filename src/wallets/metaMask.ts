import { walletStore } from '@/atoms/store'
import { addressAtom, currentChainAtom } from '@/atoms/wallet'
import { DEFAULT_CHAIN } from '@/constants/chains'
import type { Wallets } from '@/types/wallet'
import { getChain, getErrorMessage } from '@/utils'
import { type Chain, createWalletClient, custom } from 'viem'
import { BaseWallet } from './baseWallet'
import { UnexpectedError } from '@/constants'

class MetaMask extends BaseWallet implements Wallets {
  constructor() {
    super()
    this._name = 'Meta Mask'
    this._clientMap = new Map()
    this.init()
  }

  async init() {
    try {
      const [account] = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })
      const currentChain = walletStore.get(currentChainAtom)
      this._clientMap!.set(currentChain ?? DEFAULT_CHAIN.id, createWalletClient({
        account,
        chain: currentChain ? getChain(currentChain) : DEFAULT_CHAIN,
        transport: custom(window.ethereum)
      }))
      walletStore.set(addressAtom, account)
    } catch (error: unknown) {
      throw new Error(
        `${this._name} initialization error, ${getErrorMessage(error)}`
      )
    }
  }

  async connect() {
    const currentChain = walletStore.get(currentChainAtom)
    if (!currentChain) {
      throw new Error('No Chain detected')
    }

    try {
      const [address] = await this._clientMap!.get(currentChain)!.requestAddresses()
      walletStore.set(addressAtom, address)
    } catch (error: unknown) {
      throw new Error(
        `${this._name} connecting error, ${getErrorMessage(error)}`
      )
    }
  }

  async switchChain(chainId: Chain['id']) {
    if (!getChain(chainId)) {
      throw new Error(`Chain id ${chainId} is not supported`)
    }

    if (!this._clientMap) {
      throw new UnexpectedError(`Error: client map has not been initialized`)
    }

    if (!this._clientMap.has(chainId)) {
      try {
        const account = walletStore.get(addressAtom)
        this._clientMap.set(chainId, createWalletClient({
          account: account!,
          chain: getChain(chainId)!,
          transport: custom(window.ethereum)
        }))
        await this._clientMap.get(chainId)?.addChain({ chain: getChain(chainId)! })
      } catch (error: unknown) {
        throw new Error(
          `${this._name} add chain ${chainId} failed, ${getErrorMessage(error)}`
        )
      }
    }

    try {
      await this._clientMap.get(chainId)?.switchChain({ id: chainId })
      walletStore.set(currentChainAtom, chainId)
    } catch (error: unknown) {
      throw new Error(
        `${this._name} switch to chain ${chainId} failed, ${getErrorMessage(error)}`
      )
    }
  }
}

export const metaMask = new MetaMask()
