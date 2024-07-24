import { type SubmitHandler, useForm } from 'react-hook-form'
import Typography from '@mui/material/Typography'
import { publicClient } from '@/services/publicClient'
import useAccount from '@/hooks/useAccount'
import { useEffect, useMemo, useState } from 'react'
import { formatUnits } from 'viem'
import { DEFAULT_CHAIN } from '@/constants'
import SwitchChain from '@/components/form/SwitchChain'
import LoadingButton from '@mui/lab/LoadingButton'
import useTransaction from '@/hooks/useTransaction'
import { useAtom, useAtomValue } from 'jotai'
import { selectedWalletAtom } from '@/atoms/wallet'
import useWallet from '@/hooks/useWallet'
import ConnectButton from '@/components/wallet/ConnectButton'
import { transactionErrorAtom } from '@/atoms/transaction'
import SnackbarContent from '@mui/material/SnackbarContent'
import Button from '@mui/material/Button'

interface FormInputs {
  sourceChain: string
  destinationChain: string
  amount: number | string
  sourceBalance: string
  destinationBalance: string
}

export default function TransferForm() {
  const currentWallet = useAtomValue(selectedWalletAtom)
  const [error, setError] = useAtom(transactionErrorAtom)
  const { approve } = useTransaction()
  const { account, currentChain } = useAccount()
  const { isConnected } = useWallet()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, setValue, watch } = useForm<FormInputs>({
    defaultValues: {
      sourceChain: currentChain?.toString(),
      destinationChain: DEFAULT_CHAIN.id.toString(),
      sourceBalance: '0',
      destinationBalance: '0',
      amount: '0'
    },
    mode: 'onChange'
  })
  const sourceChain = watch('sourceChain')
  const destinationChain = watch('destinationChain')
  const sourceBalance = watch('sourceBalance')
  const destinationBalance = watch('destinationBalance')
  const amount = watch('amount')

  useEffect(() => {
    (async () => {
      if (account) {
        const [source, dest] = await Promise.allSettled([
          publicClient.getBalance(account!, +sourceChain),
          publicClient.getBalance(account!, +destinationChain)
        ])
        if (source.status === 'fulfilled') {
          setValue('sourceBalance', formatUnits(source.value as bigint, 6))
        }
        if (dest.status === 'fulfilled') {
          setValue('destinationBalance', formatUnits(dest.value as bigint, 6))
        }
      }
    })()
  }, [account])

  useEffect(() => {
    register('sourceChain')
    register('destinationChain')
    register('sourceBalance')
    register('destinationBalance')
    register('amount')
  }, [register])

  useEffect(() => {
    setValue('sourceChain', currentChain!.toString())
  }, [currentChain])

  const invalidAmount = useMemo(() => {
    return !account || !Number(sourceBalance) || Number(amount) <= 0 || Number(amount) > Number(sourceBalance)
  }, [account, sourceBalance, amount])

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      setLoading(true)
      const response = await approve(currentWallet!, String(data.amount))
    } catch (error: unknown) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSourceChange = async (chainId: string) => {
    setValue('sourceChain', chainId)
    const val = await publicClient.getBalance(account!, +sourceChain)
    const usdc = formatUnits(val as bigint, 6)
    setValue('sourceBalance', usdc.toString())
  }

  const handleDestinationChange = async (chaindId: string) => {
    setValue('destinationChain', chaindId)
    const val = await publicClient.getBalance(account!, +destinationBalance)
    const usdc = formatUnits(val as bigint, 6)
    setValue('destinationBalance', usdc.toString())
  }

  return (
    <>
      <div className="p-4 mx-auto flex flex-col items-center px-2 py-4 rounded-md bg-[rgb(34,34,48)] max-w-[500px] mt-10">
        <h1 className="text-white font-semibold capitalize mb-4">Transfer</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 items-center w-full justify-between">
          <div className="w-full bg-[rgb(28,28,40)] rounded-md">
            <div className="flex justify-between items-center border-b-[rgb(28,28,40)] border-b-2 p-2">
              <div className="flex items-center gap-2">
                <Typography variant="subtitle2" className="mr-4">
                  From
                </Typography>
                <SwitchChain
                  value={sourceChain}
                  defaultValue={String(currentChain)}
                  onChainChange={handleSourceChange}
                />
              </div>
              <div className="flex gap-2 items-center">
                <Typography variant="subtitle2">Bal:</Typography>
                <Typography variant="button">{`${sourceBalance} USDC`}</Typography>
              </div>
            </div>
            <div className="flex justify-between items-center p-2">
              <input {...register('amount')} className="w-full focus:border-0 outline-none bg-transparent text-[rgb(249,250,251)] font-bold" />
              <div className="flex gap-2">
                <div className="h-6 w-6 rounded-full">
                  <img src="https://assets.polygon.technology/tokenAssets/usdc.svg" className="w-full h-full" />
                </div>
                <span className="text-white font-bold">USDC</span>
              </div>
            </div>
          </div>
          <div className="w-full bg-[rgb(28,28,40)] rounded-md">
            <div className="flex justify-between items-center border-b-[rgb(28,28,40)] border-b-2 p-2">
              <div className="flex items-center gap-2 p-2">
                <Typography variant="subtitle2" className="mr-4">
                  To
                </Typography>
                <SwitchChain
                  value={destinationChain}
                  defaultValue={String(currentChain)}
                  onChainChange={handleDestinationChange}
                />
              </div>
              <div className="flex gap-2 items-center">
                <Typography variant="subtitle2">Bal:</Typography>
                <Typography variant="button">{`${destinationBalance} USDC`}</Typography>
              </div>
            </div>
            <div className="flex justify-between items-center p-2">
              <input value={amount} className="w-full focus:border-0 outline-none bg-transparent text-[rgb(249,250,251)] font-bold" disabled />
              <div className="flex gap-2">
                <div className="h-6 w-6 rounded-full">
                  <img src="https://assets.polygon.technology/tokenAssets/usdc.svg" className="w-full h-full" />
                </div>
                <span className="text-white font-bold">USDC</span>
              </div>
            </div>
          </div>
          {isConnected ? (
            <LoadingButton
              className="w-full"
              loading={loading}
              variant="contained"
              type="submit"
              disabled={invalidAmount}
            >
              Approve
            </LoadingButton>
          ) : (
            <ConnectButton />
          )}
        </form>
      </div>
      {error ? (
        <SnackbarContent
          className="mt-3"
          message={`${error.name}: ${error.message}`}
          variant="elevation"
          action={
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              onClick={() => setError(null)}
            >
              {'Close'}
            </Button>
          }
        />
      ) : null}
    </>
  )
}
