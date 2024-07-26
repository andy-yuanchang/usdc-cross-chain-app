import { walletStore } from '@/atoms/store'
import { currentChainAtom } from '@/atoms/wallet'
import { UnexpectedError } from '@/constants'
import type { SupportedWallets } from '@/types/wallet'
import { createWalletClient } from 'viem'

export class BaseWallet {
  protected _name: SupportedWallets | undefined
  protected _walletClient: ReturnType<typeof createWalletClient> | undefined
  protected _clientMap: Map<number, ReturnType<typeof createWalletClient>> | undefined

  public get name() {
    return this._name!
  }

  public get client(): ReturnType<typeof createWalletClient> {
    const currentChain = walletStore.get(currentChainAtom)
    if (!currentChain) {
      throw new UnexpectedError('No Chain detected')
    }
    return this._clientMap?.get(currentChain)!
  }
}
