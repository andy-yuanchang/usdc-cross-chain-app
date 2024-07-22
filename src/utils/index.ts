import * as chains from 'viem/chains'
import { customChains } from '@/constants/chains'

export function getChain(chainId: number): chains.Chain | undefined {
  Object.assign(chains, customChains)
  try {
    for (const chain of Object.values(chains)) {
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
