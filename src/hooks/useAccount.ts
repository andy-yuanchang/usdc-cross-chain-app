import { addressAtom, currentChainAtom } from '@/atoms/wallet'
import { publicClient } from '@/services/publicClient'
import { useAtomValue } from 'jotai'
import { useEffect, useState } from 'react'
import { formatUnits } from 'viem'

export default function useAccount() {
  const [balance, setBalance] = useState('0')
  const currentChain = useAtomValue(currentChainAtom)
  const account = useAtomValue(addressAtom)

  useEffect(() => {
    if (currentChain && account) {
      ;(async () => {
        const val = await publicClient.getBalance(account)
        if (val) {
          const usdc = formatUnits(val, 6)
          setBalance(usdc.toString())
        }
      })()
    }
  }, [currentChain, account])

  return {
    currentChain,
    account,
    // TODO: Support multiple tokens
    balance: `${balance} USDC`
  }
}
