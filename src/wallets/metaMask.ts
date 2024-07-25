import { walletStore } from '@/atoms/store'
import { addressAtom, currentChainAtom } from '@/atoms/wallet'
import { DEFAULT_CHAIN } from '@/constants/chains'
import type { Wallets } from '@/types/wallet'
import { getChain, getErrorMessage } from '@/utils'
import { type Chain, createWalletClient, custom } from 'viem'
import { BaseWallet } from './baseWallet'

class MetaMask extends BaseWallet implements Wallets {
  private _chainSet: Set<Chain['id']>
  constructor() {
    super()
    this._name = 'Meta Mask'
    this._chainSet = new Set()
    this.init()
  }

  async init() {
    try {
      const [account] = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })
      this._walletClient = createWalletClient({
        account,
        chain: DEFAULT_CHAIN,
        transport: custom(window.ethereum)
      })
      this._chainSet.add(DEFAULT_CHAIN.id)
      walletStore.set(addressAtom, account)
    } catch (error: unknown) {
      throw new Error(
        `${this._name} initialization error, ${getErrorMessage(error)}`
      )
    }
  }

  async connect() {
    if (!this._walletClient) {
      throw new Error(`${this._name} client hasn't been initialized`)
    }

    try {
      const [address] = await this._walletClient.requestAddresses()
      walletStore.set(addressAtom, address)
    } catch (error: unknown) {
      throw new Error(
        `${this._name} connecting error, ${getErrorMessage(error)}`
      )
    }
  }

  async switchChain(chainId: Chain['id']) {
    if (!this._walletClient) {
      throw new Error(`${this._name} client hasn't been initialized`)
    }

    if (!getChain(chainId)) {
      throw new Error(`Chain id ${chainId} is not supported`)
    }

    if (!this._chainSet.has(chainId)) {
      try {
        await this._walletClient.addChain({ chain: getChain(chainId)! })
        this._chainSet.add(chainId)
      } catch (error: unknown) {
        throw new Error(
          `${this._name} add chain ${chainId} failed, ${getErrorMessage(error)}`
        )
      }
    }

    try {
      await this._walletClient.switchChain({ id: chainId })
      walletStore.set(currentChainAtom, chainId)
    } catch (error: unknown) {
      throw new Error(
        `${this._name} switch to chain ${chainId} failed, ${getErrorMessage(error)}`
      )
    }
  }
}

export const metaMask = new MetaMask()
