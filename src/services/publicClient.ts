import { walletStore } from '@/atoms/store'
import { currentChainAtom } from '@/atoms/wallet'
import { DEFAULT_CHAIN } from '@/constants'
import { UnexpectedError } from '@/constants/errors'
import { http, createPublicClient, type Chain, type Address } from 'viem'

class PublicClient {
  private _clientCache: Map<Chain['id'], ReturnType<typeof createPublicClient>>

  constructor() {
    this._clientCache = new Map()
    this._clientCache.set(DEFAULT_CHAIN.id, createPublicClient({ chain: DEFAULT_CHAIN, transport: http() }))
  }

  async getBalance(address: Address): Promise<bigint | undefined> {
    if (!address)
      throw new UnexpectedError('Missing the address as params')
    
    const currentChain = walletStore.get(currentChainAtom)
    if (!currentChain)
      throw new UnexpectedError('No Chain detected')

    if (!this._clientCache.has(currentChain.id))
      this._clientCache.set(currentChain.id, createPublicClient({ chain: currentChain, transport: http() }))

    return await this._clientCache.get(currentChain.id)?.getBalance({
      address,
      blockTag: 'safe'
    })
  }
}

export const publicClient = new PublicClient()
