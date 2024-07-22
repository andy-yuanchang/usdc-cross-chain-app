import { EthereumProvider } from '@walletconnect/ethereum-provider'
import { SupportedWallets, Wallets } from '@/types/wallet';
import { type Chain, createWalletClient, custom } from 'viem'
import { addressAtom, currentChainAtom } from '@/atoms/wallet'
import { SUPPORTED_CHAINS, WALLET_CONNECT_PROJECT_ID } from '@/constants'
import { DEFAULT_CHAIN } from '@/constants/chains'
import { getChain, getErrorMessage } from '@/utils'
import { walletStore } from '@/atoms/store'
import type { EthereumProvider as Provider } from '@walletconnect/ethereum-provider/dist/types/EthereumProvider';

class WalletConnect implements Wallets {
  private _name: SupportedWallets
  private _walletClient: ReturnType<typeof createWalletClient> | undefined
  private _provider: Provider | undefined
  constructor() {
    this._name = 'Wallet Connect'
    this.init()
  }

  public get name() {
    return this._name
  }

  async init() {
    /**
     * @reference https://github.com/wevm/viem/discussions/753
     */
    try {
      const provider = await EthereumProvider.init({
        chains: [...SUPPORTED_CHAINS.map(chain => chain.id)],
        projectId: WALLET_CONNECT_PROJECT_ID,
        showQrModal: true,
        qrModalOptions: {
          themeVariables: {
            
          }
        }
      } as any);
      this._provider = provider

      provider.on('chainChanged', (chainId: string) => {
        walletStore.set(currentChainAtom, getChain(+chainId));
      });

      const walletClient = createWalletClient({
        chain: DEFAULT_CHAIN,
        transport: custom(provider),
      });

      if (!walletClient) {
        throw new Error(`create wallet client failed`)
      }
      this._walletClient = walletClient
    } catch (error: unknown) {
      console.log(error)
      throw new Error(`${this._name} initialization error, ${getErrorMessage(error)}`)
    }
  }

  async connect() {
    if (!this._walletClient) {
      throw new Error(`${this._name} client hasn't been initialized`)
    }

    await this._provider?.connect();
    try {
      const [address] = await this._walletClient.requestAddresses();
      walletStore.set(addressAtom, address)
    } catch (error: unknown) {
      console.log(error)
      throw new Error(`${this._name} connecting error, ${getErrorMessage(error)}`)
    }
  }

  async switchChain(chainId: Chain['id']) {
    if (!this._walletClient) {
      throw new Error(`${this._name} client hasn't been initialized`)
    }

    try {
      await this._walletClient.switchChain({ id: chainId })
    } catch (error: unknown) {
      throw new Error(`${this._name} switch to chain ${chainId}, ${getErrorMessage(error)}`)
    }
  }
}

export const walletConnect = new WalletConnect()