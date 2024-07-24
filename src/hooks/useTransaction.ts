import { ERC_20_ABI } from '@/abis/erc20'
import { TOKEN_MESSENGER_ABI } from '@/abis/TokenMessenger'
import { walletStore } from '@/atoms/store'
import { transactionErrorAtom } from '@/atoms/transaction'
import { addressAtom, currentChainAtom } from '@/atoms/wallet'
import {
  CCTP_DOMAIN_ID,
  TOKEN_MESSENGER_ADDRESS_MAP,
  UnexpectedError,
  USDC_CONTRACT_ADDRESS_MAP
} from '@/constants'
import { publicClient } from '@/services/publicClient'
import { SupportedChainIds, SupportedChains } from '@/types/wallet'
import { getChain, getErrorMessage, getWallet } from '@/utils'
import { useSetAtom } from 'jotai'
import { getContract, parseUnits } from 'viem'

export default function useTransaction() {
  const setError = useSetAtom(transactionErrorAtom)

  const approve = async (walletName: string, amount: string) => {
    const wallet = getWallet(walletName)
    if (!wallet) {
      setError(
        new Error('No wallet detected, please choose a wallet to connect')
      )
      return
    }

    const amountUnits = parseUnits(amount, 6)
    if (amountUnits > 0) {
      const chain = getChain(walletStore.get(currentChainAtom)!)
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
          public: publicClient.client,
          wallet: wallet.client
        }
      })

      try {
        const response = await contract.write.approve([
          TOKEN_MESSENGER_ADDRESS_MAP[name],
          amountUnits.toString()
        ])
        if (!response) {
          throw new UnexpectedError(
            `Error when approving the transaction, function 'approve' return null or undefined`
          )
        }
      } catch (error: unknown) {
        setError(new Error(getErrorMessage(error)))
      }
    }
  }

  const transfer = async (name: string, amount: string) => {
    const wallet = getWallet(name)
    if (!wallet) {
      setError(
        new Error('No wallet detected, please choose a wallet to connect')
      )
      return
    }

    const chain = getChain(walletStore.get(currentChainAtom)!)
    const chainName = chain?.name as SupportedChains
    const chainId = chain?.id as SupportedChainIds
    const address = walletStore.get(addressAtom)
    if (!chainName || !chainId || !address) {
      throw new Error(
        `Error when transferring USDC, Chain Name: '${chainName}', Chaind ID: '${chainId}', Account: '${address}'`
      )
    }

    const contract = getContract({
      abi: TOKEN_MESSENGER_ABI,
      address: TOKEN_MESSENGER_ADDRESS_MAP[chainName],
      client: {
        public: publicClient.client,
        wallet: wallet.client
      }
    })

    const response = await contract.write.depositForBurn([
      amount,
      CCTP_DOMAIN_ID[chainId],
      address,
      USDC_CONTRACT_ADDRESS_MAP[chainName]
    ])

    if (!response) {
      throw new UnexpectedError(
        `Error when transferring USDC, function 'depositForBurn' return null or undefined`
      )
    }

    const { hash } = response
    return response
  }

  return {
    approve,
    transfer
  }
}
