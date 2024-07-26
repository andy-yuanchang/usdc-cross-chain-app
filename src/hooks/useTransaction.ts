import { TOKEN_MESSENGER_ABI } from '@/abis/TokenMessenger'
import { walletStore } from '@/atoms/store'
import { transactionErrorAtom } from '@/atoms/transaction'
import { addressAtom, currentChainAtom } from '@/atoms/wallet'
import {
  CCTP_DOMAIN_ID,
  MESSAGE_TRANSMITTER_ADDRESS_MAP,
  TOKEN_MESSENGER_ADDRESS_MAP,
  UnexpectedError,
  USDC_CONTRACT_ADDRESS_MAP
} from '@/constants'
import { publicClient } from '@/services/publicClient'
import type { SupportedChainIds, SupportedChains } from '@/types/wallet'
import { addressToBytes32, getChain, getWallet } from '@/utils'
import { useSetAtom } from 'jotai'
import {
  type AbiParameter,
  type Address,
  decodeAbiParameters,
  getContract,
  keccak256,
  parseUnits,
  toHex,
  type TransactionReceipt
} from 'viem'
import usePersistentCallback from '@/hooks/usePersistentCallback'
import { MESSAGE_TRANSMITTER_ABI } from '@/abis/MessageTransmitter'
import { ERC_20_ABI } from '@/abis/erc20'

export default function useTransaction() {
  const setError = useSetAtom(transactionErrorAtom)

  const approve = usePersistentCallback(
    async (walletName: string, amount: string) => {
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
            `Error when approving the transaction, Chain Name: '${name}', Chain ID: '${chainId}'`
          )
        }

        const contractAddress = USDC_CONTRACT_ADDRESS_MAP[name]
        if (!contractAddress) {
          throw new Error(
            `Error: No USDC contract address found for chain '${name}'`
          )
        }

        console.log({
          ERC_20_ABI,
          contractAddress,
          client: {
            public: publicClient.client,
            wallet: wallet.client
          }
        })
        const contract = getContract({
          abi: ERC_20_ABI,
          address: contractAddress,
          client: {
            public: publicClient.client,
            wallet: wallet.client
          }
        })

        const response = await contract.write.approve([
          TOKEN_MESSENGER_ADDRESS_MAP[name],
          amountUnits.toString()
        ])
        if (!response) {
          throw new UnexpectedError(
            `Error when approving the transaction, function 'approve' returned null or undefined`
          )
        }
        return response
      }
    }
  )

  const depositForBurn = usePersistentCallback(
    async (name: string, amount: string) => {
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
          `Error when burning USDC, Chain Name: '${chainName}', Chain ID: '${chainId}', Account: '${address}'`
        )
      }

      const tokenMessengerAddress = TOKEN_MESSENGER_ADDRESS_MAP[chainName]
      if (!tokenMessengerAddress) {
        throw new Error(
          `Error: No TokenMessenger address found for chain '${chainName}'`
        )
      }

      const contract = getContract({
        abi: TOKEN_MESSENGER_ABI,
        address: tokenMessengerAddress,
        client: {
          public: publicClient.client,
          wallet: wallet.client
        }
      })

      const usdcContractAddress = USDC_CONTRACT_ADDRESS_MAP[chainName]
      if (!usdcContractAddress) {
        throw new Error(
          `Error: No USDC Contract address found for chain '${chainName}'`
        )
      }

      console.log({
        amount: parseUnits(amount, 6),
        destinationDomain: CCTP_DOMAIN_ID[chainId],
        address: addressToBytes32(address),
        burnToken: usdcContractAddress
      })
      const response = await contract.write.depositForBurn([
        parseUnits(amount, 6),
        CCTP_DOMAIN_ID[chainId],
        addressToBytes32(address),
        usdcContractAddress
      ])
      if (!response) {
        throw new UnexpectedError(
          `Error when burning USDC, function 'depositForBurn' returned null or undefined`
        )
      }
      return response
    }
  )

  const getTransactionReceipt = usePersistentCallback(async (hash: Address, chainId?: number) => {
    const chain = getChain(walletStore.get(currentChainAtom)!)
    if (!chain) {
      throw new Error(
        `Error when getting Transaction Receipt ${hash}, current chain is 'undefined' or 'null'`
      )
    }
    return new Promise((resolve) => {
      let intervalId = setInterval(async () => {
        console.log('getTransactionReceipt', chainId ?? chain?.id, hash)
        const transaction = await publicClient.getTransactionReceipt(hash, chainId ? chainId : chain?.id)
        if (transaction) {
          resolve(transaction)
          clearInterval(intervalId)
        }
      }, 3000)
    })
  })

  const getMessageHash = usePersistentCallback(
    async (
      burnTx: Address
    ): Promise<{ messageHash: string; messageBytes: string }> => {
      if (!burnTx) {
        throw new UnexpectedError('BurnTx is undefined')
      }
      const transactionReceipt = (await getTransactionReceipt(
        burnTx
      )) as TransactionReceipt
      const eventLog = keccak256(toHex('MessageSent(bytes)'))
      console.log({ eventLog })
      const log = transactionReceipt.logs.find(
        (log) => log.topics[0] === eventLog
      )
      if (!log) {
        throw new Error('Log for MessageSent(bytes) event not found')
      }
      const abiParameters: AbiParameter[] = [{ type: 'bytes', name: 'message' }]
      const [messageBytes] = decodeAbiParameters(abiParameters, log?.data)
      const messageHash = keccak256(messageBytes)
      return { messageHash, messageBytes: messageBytes as string }
    }
  )

  const receiveMessage = usePersistentCallback(
    async (
      walletName: string,
      { messageBytes, attestationSignature, destinationChainId }
    ): Promise<TransactionReceipt> => {
      const wallet = getWallet(walletName)
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
          `Error when receiving message, Chain Name: '${chainName}', Chain ID: '${chainId}', Account: '${address}'`
        )
      }

      const messageTransmitterAddress =
        MESSAGE_TRANSMITTER_ADDRESS_MAP[chainName]
      if (!messageTransmitterAddress) {
        throw new Error(
          `Error: No MessageTransmitter address found for chain '${chainName}'`
        )
      }

      const contract = getContract({
        abi: MESSAGE_TRANSMITTER_ABI,
        address: messageTransmitterAddress,
        client: {
          public: publicClient.client,
          wallet: wallet.client
        }
      })

      const receiveTx = await contract.write.receiveMessage([
        messageBytes,
        attestationSignature
      ])
      if (!receiveTx) {
        throw new UnexpectedError(
          `Error when receiving message, function 'receiveMessage' returned null or undefined`
        )
      }

      // polling receipt
      const transactionReceipt = (await getTransactionReceipt(
        receiveTx,
        destinationChainId
      )) as TransactionReceipt
      return transactionReceipt
    }
  )

  const getTransactionHistory = usePersistentCallback(async () => {
    const endingBlockNumber = await publicClient.client.getBlockNumber()
    const startingBlockNumber = endingBlockNumber - BigInt(100)
    const address = addressToBytes32(walletStore.get(addressAtom)!)
    for (let i = startingBlockNumber; i <= endingBlockNumber; i++) {
      const block = await publicClient.client.getBlock({ blockNumber: i })
      for (const transaction of block.transactions) {
        if (transaction) {
        }
      }
    }
  })

  return {
    approve,
    depositForBurn,
    getTransactionReceipt,
    getMessageHash,
    receiveMessage
  }
}
