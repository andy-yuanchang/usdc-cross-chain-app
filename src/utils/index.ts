import * as chains from 'viem/chains'
import { customChains } from '@/constants/chains'
import { Address, isAddress } from 'viem'
import { wallets } from '@/wallets'

export function getWallet(name: string) {
  return wallets.find((wallet) => wallet.name === name)
}

export function getChain(chainId: number): chains.Chain | undefined {
  try {
    const allChains = { ...chains, ...customChains }
    for (const chain of Object.values(allChains)) {
      if (chain.id === chainId) {
        return chain
      }
    }
  } catch (error) {
    throw new Error(`Chain with id ${chainId} not found`)
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return `${error.name} ${error.message}`
  } else if (typeof error === 'string') {
    return error
  }
  return ''
}

export function shortenAddress(address: Address | null) {
  if (!address) {
    return ''
  }
  if (!isAddress(address)) {
    return address
  }
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function addressToBytes32(address: Address) {
  return (
    address.slice(0, 2) +
    '000000000000000000000000' +
    address.slice(2, address.length)
  )
}
