import type { SupportedWallets } from '@/types/wallet'
import { createWalletClient } from 'viem'

export class BaseWallet {
  protected _name: SupportedWallets | undefined
  protected _walletClient: ReturnType<typeof createWalletClient> | undefined

  public get name() {
    return this._name!
  }

  public get client(): ReturnType<typeof createWalletClient> {
    return this._walletClient!
  }
}
