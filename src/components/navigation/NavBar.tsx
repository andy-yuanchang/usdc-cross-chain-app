import { IMAGE_PATHS } from '@/constants'
import useAccount from '@/hooks/useAccount'
import { useModalState } from '@/hooks/useModalState'
import useWallet from '@/hooks/useWallet'
import Button from '@mui/material/Button'
import WalletMenu from '@/components/wallet/WalletMenu'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Link from '@mui/material/Link'
import { NavLink } from 'react-router-dom'
import { Avatar, ListItemIcon, MenuItem, Typography } from '@mui/material'
import { getChain, shortenAddress } from '@/utils'
import { useAtomValue } from 'jotai'
import { selectedWalletAtom } from '@/atoms/wallet'
import SwitchChain from '@/components/form/SwitchChain'

export default function NavBar() {
  const { isConnected, switchChain } = useWallet()
  const { account, balance, currentChain } = useAccount()
  const { isOpen, onOpen, onClose } = useModalState()
  const selectedWallet = useAtomValue(selectedWalletAtom)

  const handleConnect = () => {
    onOpen()
  }

  const handleSwitchChain = (chainId: string) => {
    switchChain(selectedWallet || '', +chainId)
  }

  return (
    <>
      <header className="flex justify-between items-center max-w-[1200px] px-10 w-full mx-auto h-20">
        <div className="flex items-center flex-shrink-0">
          <Link component={NavLink} to="/" className="mr-7">
            <img src="/bungee-logo.svg" alt="Bungee Logo" />
          </Link>
          <nav className="hidden sm:block">
            <ul className="flex">
              <li className="mx-8" key="transfer">
                <Link component={NavLink} to="/">
                  Transfer
                </Link>
              </li>
              <li className="mx-8" key="transaction history">
                <Link component={NavLink} to="/transactions">
                  Transaction History
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex">
          {isConnected ? (
            <>
              <div className="flex items-center gap-2 p-2 bg-[rgb(38,38,54)] rounded-lg mr-3">
                <Avatar />
                <Typography variant="button">{balance}</Typography>
                <div className="bg-[rgb(28,28,40)] rounded-md p-1">
                  <Typography variant="button">
                    {shortenAddress(account)}
                  </Typography>
                </div>
              </div>
              <div className="p-2 bg-[rgb(38,38,54)] rounded-lg">
                <SwitchChain
                  value={String(currentChain)}
                  onChainChange={handleSwitchChain}
                  defaultValue={String(currentChain)}
                />
              </div>
            </>
          ) : (
            <Button variant="text" onClick={handleConnect}>
              Connect Wallet
            </Button>
          )}
        </div>
      </header>
      <WalletMenu open={isOpen} onClose={onClose} />
    </>
  )
}
