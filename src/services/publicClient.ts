import { ERC_20_ABI } from '@/abis/erc20'
import { walletStore } from '@/atoms/store'
import { currentChainAtom } from '@/atoms/wallet'
import { DEFAULT_CHAIN, USDC_CONTRACT_ADDRESS_MAP } from '@/constants'
import { UnexpectedError } from '@/constants/errors'
import { SupportedChainIds, SupportedChains } from '@/types/wallet'
import { getChain } from '@/utils'
import { http, createPublicClient, type Address, getContract } from 'viem'

class PublicClient {
  private _client: ReturnType<typeof createPublicClient>

  constructor() {
    const chainId = walletStore.get(currentChainAtom)
    if (!chainId) {
      walletStore.set(currentChainAtom, DEFAULT_CHAIN.id)
    }
    this._client = createPublicClient({
      chain: chainId ? getChain(chainId) : DEFAULT_CHAIN,
      transport: http()
    })
  }

  public get client(): ReturnType<typeof createPublicClient> {
    return this._client
  }

  async getBalance(address: Address, id?: number): Promise<bigint | undefined> {
    if (!address) throw new UnexpectedError('Missing the address as params')

    const currentChain = walletStore.get(currentChainAtom)
    const currentChainId = id ? id : currentChain
    if (!currentChainId) throw new UnexpectedError('No Chain detected')

    const chain = getChain(currentChainId)
    const name = chain?.name as SupportedChains
    const chainId = chain?.id as SupportedChainIds
    if (!name || !chainId) {
      throw new Error(
        `Error when approving the transaction, Chain Name: '${name}', Chaind ID: '${chainId}'`
      )
    }

    const contract = getContract({
      abi: ERC_20_ABI,
      address: USDC_CONTRACT_ADDRESS_MAP[name],
      client: {
        public: publicClient.client
      }
    })

    return (await contract.read.balanceOf([address])) as Promise<
      bigint | undefined
    >
  }
}

export const publicClient = new PublicClient()
