import Button from '@mui/material/Button'
import SnackbarContent from '@mui/material/SnackbarContent';
import { useModalState } from '@/hooks/useModalState'
import WalletMenu from '@/components/wallet/WalletMenu'
import { useAtom } from 'jotai';
import { walletErrorAtom } from '@/atoms/wallet';

export default function WalletConnector() {
  const { isOpen, onOpen, onClose } = useModalState()
  const [error, setError] = useAtom(walletErrorAtom)

  const handleConnect = () => {
    onOpen()
  }

  const handleCloseErrorMessage = () => {
    setError(null)
  }

  return (
    <>
      <Button variant="contained" onClick={handleConnect}>Connect Wallet</Button>
      <WalletMenu open={isOpen} onClose={onClose} />
      {error ? <SnackbarContent message={`${error.name}: ${error.message}`} action={<Button variant="outlined" color="secondary" size="small" onClick={handleCloseErrorMessage}>{'Close'}</Button>} /> : null}
    </>
  )
}