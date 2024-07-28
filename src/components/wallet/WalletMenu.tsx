import { selectedWalletAtom } from '@/atoms/wallet'
import { SUPPORTED_WALLETS } from '@/constants'
import useWallet from '@/hooks/useWallet'
import { SupportedWallets } from '@/types/wallet'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CloseIcon from '@mui/icons-material/close'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import { useAtom } from 'jotai'
import { useEffect, useMemo } from 'react'

interface WalletMenuProps {
  open: boolean
  onClose: () => void
}

export default function WalletMenu({ open, onClose }: WalletMenuProps) {
  const { connect, connectionStatus, cancel } = useWallet()
  const [selectedWallet, setSelectedWallet] = useAtom(selectedWalletAtom)
  const walletImgPath = useMemo(() => {
    return SUPPORTED_WALLETS.find((wallet) => wallet.name === selectedWallet)
      ?.imgPath
  }, [selectedWallet])

  useEffect(() => {
    if (connectionStatus === 'connected') {
      onClose()
    }
  }, [connectionStatus])

  const handleConnect = async (name: SupportedWallets) => {
    setSelectedWallet(name)
    await connect(name)
  }

  const handleRetry = async () => {
    await connect(selectedWallet!)
  }

  const handleClose = () => {
    onClose()
    cancel()
  }

  return (
    <Dialog onClose={handleClose} open={open} maxWidth="xs" fullWidth>
      {connectionStatus === 'connecting' ||
        connectionStatus === 'user-rejected' ? (
        <IconButton
          onClick={cancel}
          sx={{
            position: 'absolute',
            left: 8,
            top: 10,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      ) : null}
      <DialogTitle textAlign="center">Connect a Wallet</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 10,
          color: (theme) => theme.palette.grey[500]
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent className="max-h-[454px] overflow-y-auto">
        {connectionStatus === 'connecting' ||
          connectionStatus === 'user-rejected' ? (
          <Box className="flex flex-col justify-center items-center min-h-[396px] text-center">
            <Avatar
              src={walletImgPath}
              alt={`${selectedWallet} avatar`}
              variant="rounded"
              className="mb-2"
            />
            <Typography
              variant="h2"
              fontSize="18px"
              lineHeight="24px"
              fontWeight="500"
              gutterBottom
            >
              {`Opening ${selectedWallet} Wallet...`}
            </Typography>
            <Typography
              variant="subtitle1"
              color="gray"
              fontSize="14px"
              lineHeight="18px"
              gutterBottom
            >
              Confirm connection in the extension
            </Typography>
            {connectionStatus === 'connecting' ? (
              <CircularProgress color="inherit" sx={{ textAlign: 'center' }} />
            ) : (
              <Button variant="contained" color="primary" onClick={handleRetry}>
                Retry
              </Button>
            )}
          </Box>
        ) : (
          <List className="min-h-[396px]">
            {SUPPORTED_WALLETS.map(({ name, imgPath }) => (
              <ListItem disableGutters key={name}>
                <ListItemButton onClick={() => handleConnect(name)}>
                  <ListItemAvatar>
                    <Avatar
                      src={imgPath}
                      alt={`${name} avatar`}
                      variant="rounded"
                    />
                  </ListItemAvatar>
                  <ListItemText primary={name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  )
}
