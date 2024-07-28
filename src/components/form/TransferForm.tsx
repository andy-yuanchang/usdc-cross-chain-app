import {
  approvalStatusAtom,
  transactionAtom,
  transactionErrorAtom
} from '@/atoms/transaction'
import { selectedWalletAtom } from '@/atoms/wallet'
import SwitchChain from '@/components/form/SwitchChain'
import ConnectButton from '@/components/wallet/ConnectButton'
import { DEFAULT_CHAIN } from '@/constants'
import useAccount from '@/hooks/useAccount'
import useTransaction from '@/hooks/useTransaction'
import useWallet from '@/hooks/useWallet'
import { attestationClient } from '@/services/attestationClient'
import { publicClient } from '@/services/publicClient'
import { SupportedChainIds } from '@/types/wallet'
import { getErrorMessage } from '@/utils'
import LoadingButton from '@mui/lab/LoadingButton'
import Typography from '@mui/material/Typography'
import { useAtom, useAtomValue } from 'jotai'
import { useEffect, useMemo, useState } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { formatUnits, TransactionReceipt } from 'viem'
import ToastMessage from '../common/ToastMessage'

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
  // TODO: refactor the progress state management, now it uses a handy way to handle it
  const [receivedTxReceipt, setReceivedTxReceipt] = useState<TransactionReceipt | null>(null)
  const [changeChainBeforeApproval, setChangeChainBeforeApproval] = useState(false)
  const [transactionStatus, setTransactionStatus] = useAtom(transactionAtom)
  const [approvalStatus, setApprovalStatus] = useAtom(approvalStatusAtom)
  const {
    approve,
    getTransactionReceipt,
    depositForBurn,
    getMessageHash,
    receiveMessage
  } = useTransaction()
  const { account, currentChain } = useAccount()
  const { isConnected, switchChain } = useWallet()
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
    ; (async () => {
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
  }, [account, sourceChain, destinationChain])

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
    return (
      !account ||
      !Number(sourceBalance) ||
      Number(amount) <= 0 ||
      Number(amount) > Number(sourceBalance)
    )
  }, [account, sourceBalance, amount])

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      setReceivedTxReceipt(null)
      setError(null)
      // step 1
      setApprovalStatus('approving')
      if (changeChainBeforeApproval) {
        await switchChain(currentWallet!, +data.sourceChain)
        setChangeChainBeforeApproval(false)
      }
      const approveTx = await approve(currentWallet!, String(data.amount))
      setApprovalStatus('waiting for the receipt')
      await getTransactionReceipt(approveTx!)
      setApprovalStatus('approved')
      // step 2
      const burnTx = await depositForBurn(currentWallet!, String(data.amount), +data.destinationChain as SupportedChainIds)
      // step 3
      setApprovalStatus('waiting for the receipt')
      const { messageHash, messageBytes } = await getMessageHash(burnTx!)
      // step 4
      setTransactionStatus('pending')
      const attestationSignature =
        await attestationClient.getAttestation(messageHash)
      // step 5
      setTransactionStatus('waiting for the receipt')
      const receipt = await receiveMessage(currentWallet!, {
        messageBytes,
        attestationSignature,
        destinationChainId: +data.destinationChain
      })
      setTransactionStatus('confirmed')
      setReceivedTxReceipt(receipt)
    } catch (error: unknown) {
      setError(new Error(getErrorMessage(error)))
    } finally {
      handleClose()
    }
  }

  const handleSourceChange = async (chainId: string) => {
    if (!!approvalStatus || !!transactionStatus) return
    setValue('sourceChain', chainId)
    if (+chainId !== currentChain) {
      setChangeChainBeforeApproval(true)
    }
    const val = await publicClient.getBalance(account!, +chainId)
    const usdc = formatUnits(val as bigint, 6)
    setValue('sourceBalance', usdc.toString())
  }

  const handleDestinationChange = async (chaindId: string) => {
    if (!!approvalStatus || !!transactionStatus) return
    setValue('destinationChain', chaindId)
    const val = await publicClient.getBalance(account!, +chaindId)
    const usdc = formatUnits(val as bigint, 6)
    setValue('destinationBalance', usdc.toString())
  }

  const handleClose = () => {
    setTransactionStatus(null)
    setApprovalStatus(null)
  }

  return (
    <>
      <div className="p-4 mx-auto flex flex-col items-center px-2 py-4 rounded-md bg-[rgb(34,34,48)] max-w-[500px] mt-10">
        <h1 className="text-white font-semibold capitalize mb-4">Transfer</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 items-center w-full justify-between"
        >
          <div className="w-full bg-[rgb(28,28,40)] rounded-md">
            <div className="flex justify-between items-center border-b-[rgb(28,28,40)] border-b-2 p-2">
              <div className="flex items-center gap-2">
                <Typography variant="subtitle2" className="mr-4">
                  From
                </Typography>
                <SwitchChain
                  defaultValue={String(currentChain)}
                  onChainChange={handleSourceChange}
                  disabled={!!approvalStatus || !!transactionStatus}
                />
              </div>
              <div className="flex gap-2 items-center">
                <Typography variant="subtitle2">Bal:</Typography>
                <Typography variant="button">{`${sourceBalance} USDC`}</Typography>
              </div>
            </div>
            <div className="flex justify-between items-center p-2">
              <input
                {...register('amount')}
                className="w-full focus:border-0 outline-none bg-transparent text-[rgb(249,250,251)] font-bold"
                disabled={!!approvalStatus || !!transactionStatus}
              />
              <div className="flex gap-2">
                <div className="h-6 w-6 rounded-full">
                  <img
                    src="https://assets.polygon.technology/tokenAssets/usdc.svg"
                    className="w-full h-full"
                  />
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
                  defaultValue={String(currentChain)}
                  onChainChange={handleDestinationChange}
                  disabled={!!approvalStatus || !!transactionStatus}
                />
              </div>
              <div className="flex gap-2 items-center">
                <Typography variant="subtitle2">Bal:</Typography>
                <Typography variant="button">{`${destinationBalance} USDC`}</Typography>
              </div>
            </div>
            <div className="flex justify-between items-center p-2">
              <input
                value={amount}
                className="w-full focus:border-0 outline-none bg-transparent text-[rgb(249,250,251)] font-bold"
                disabled
              />
              <div className="flex gap-2">
                <div className="h-6 w-6 rounded-full">
                  <img
                    src="https://assets.polygon.technology/tokenAssets/usdc.svg"
                    className="w-full h-full"
                  />
                </div>
                <span className="text-white font-bold">USDC</span>
              </div>
            </div>
          </div>
          {isConnected ? (
            <LoadingButton
              loadingPosition="end"
              className="w-full"
              loading={!!transactionStatus || !!approvalStatus}
              variant="contained"
              type="submit"
              disabled={invalidAmount}
            >
              {changeChainBeforeApproval ? 'Switch Chain' : transactionStatus || approvalStatus || 'Approve'}
            </LoadingButton>
          ) : (
            <ConnectButton />
          )}
        </form>
      </div>
      {error ? (
        <ToastMessage
          defaultValue={!!error}
          message={`${error.name}: ${error.message}`}
          severity="error"
        />
      ) : null}
      {
        receivedTxReceipt ? <ToastMessage severity="success" defaultValue={!!receivedTxReceipt} message={JSON.stringify(receivedTxReceipt, (_, value) => (typeof value === 'bigint' ? value.toString() : value), 2)} /> : null
      }
    </>
  )
}
