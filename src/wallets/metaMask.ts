import { addressAtom, currentChainAtom } from '@/atoms/wallet'
import { Wallets, SupportedWallets } from '@/types/wallet'
import { type Chain, createWalletClient, custom } from 'viem'
import { DEFAULT_CHAIN } from '@/constants/chains'
import { walletStore } from '@/atoms/store'
import { getChain, getErrorMessage } from '@/utils'

class MetaMask implements Wallets {
  private _name: SupportedWallets
  private _walletClient: ReturnType<typeof createWalletClient> | undefined
  constructor() {
    this._name = 'Meta Mask'
    this.init()
  }

  async init() {
    try {
      this._walletClient = createWalletClient({
        chain: DEFAULT_CHAIN,
        transport: custom(window.ethereum)
      })
    } catch (error: unknown) {
      throw new Error(
        `${this._name} initialization error, ${getErrorMessage(error)}`
      )
    }
  }

  public get name() {
    return this._name
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

    try {
      await this._walletClient.switchChain({ id: chainId })
      walletStore.set(currentChainAtom, getChain(+chainId))
    } catch (error: unknown) {
      throw new Error(
        `${this._name} switch to chain ${chainId}, ${getErrorMessage(error)}`
      )
    }
  }
}

export const metaMask = new MetaMask()
