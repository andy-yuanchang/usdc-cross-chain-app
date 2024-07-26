import { ERC_20_ABI } from '@/abis/erc20'
import { walletStore } from '@/atoms/store'
import { currentChainAtom } from '@/atoms/wallet'
import { DEFAULT_CHAIN, USDC_CONTRACT_ADDRESS_MAP } from '@/constants'
import { UnexpectedError } from '@/constants/errors'
import { SupportedChainIds, SupportedChains } from '@/types/wallet'
import { getChain } from '@/utils'
import { http, createPublicClient, type Address, getContract } from 'viem'

class PublicClient {
  private _clientMap: Map<number, ReturnType<typeof createPublicClient>>

  constructor() {
    const chainId = walletStore.get(currentChainAtom)
    if (!chainId) {
      walletStore.set(currentChainAtom, DEFAULT_CHAIN.id)
    }
    this._clientMap = new Map()
    this._clientMap.set(chainId ?? DEFAULT_CHAIN.id, createPublicClient({
      chain: chainId ? getChain(chainId) : DEFAULT_CHAIN,
      transport: http(),
    }))
  }

  public get client(): ReturnType<typeof createPublicClient> {
    const chainId = walletStore.get(currentChainAtom)
    if (!chainId) {
      throw new Error(`Error: when get public client, ${chainId} is 'undefined' or 'null'`)
    }
    if (!this._clientMap.has(chainId)) {
      this._clientMap.set(chainId, createPublicClient({
        chain: getChain(chainId),
        transport: http(),
      }))
    }
    return this._clientMap.get(chainId)!
  }

  async getBalance(address: Address, id?: number): Promise<bigint | undefined> {
    if (!address) throw new UnexpectedError('Missing the address as params')

    const currentChain = walletStore.get(currentChainAtom)
    const currentChainId = id ? id : currentChain
    console.log(id, currentChainId)
    if (!currentChainId) throw new UnexpectedError('No Chain detected')

    const chain = getChain(currentChainId)
    const name = chain?.name as SupportedChains
    const chainId = chain?.id as SupportedChainIds
    if (!name || !chainId) {
      throw new Error(
        `Error when approving the transaction, Chain Name: '${name}', Chaind ID: '${chainId}'`
      )
    }

    const usdcContractAddress = USDC_CONTRACT_ADDRESS_MAP[name]
    if (!usdcContractAddress) {
      throw new Error(
        `Error: No USDC contract address found for chain '${name}'`
      )
    }

    console.log(this._clientMap.get(chainId))

    const contract = getContract({
      abi: ERC_20_ABI,
      address: usdcContractAddress,
      client: {
        public: this._clientMap.get(chainId)!
      }
    })

    return (await contract.read.balanceOf([address])) as Promise<
      bigint | undefined
    >
  }

  async getTransactionReceipt(hash: Address, chainId: number) {
    return await this._clientMap.get(chainId)!.getTransactionReceipt({ hash })
  }
}

export const publicClient = new PublicClient()
