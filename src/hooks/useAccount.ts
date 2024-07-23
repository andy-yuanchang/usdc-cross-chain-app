import { addressAtom, currentChainAtom } from "@/atoms/wallet"
import { publicClient } from "@/services/publicClient"
import { useAtomValue } from "jotai"
import { useEffect, useState } from "react"

export default function useAccount() {
  const [balance, setBalance] = useState<bigint>(BigInt(0))
  const currentChain = useAtomValue(currentChainAtom)
  const account = useAtomValue(addressAtom)

  useEffect(() => {
    if (currentChain && account) {
      (async () => {
        const val = await publicClient.getBalance(account)
        if (val) {
          setBalance(val)
        }
      })()
    }
  }, [currentChain, account])

  return {
    currentChain,
    account,
    balance
  }
}
