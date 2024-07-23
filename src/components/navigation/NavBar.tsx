import { SUPPORTED_CHAINS } from "@/constants";
import useAccount from "@/hooks/useAccount";
import { useModalState } from "@/hooks/useModalState";
import useWallet from "@/hooks/useWallet";
import Button from '@mui/material/Button'
import WalletMenu from "@/components/wallet/WalletMenu";
import Select from "@mui/material/Select";
import { NavLink as Link, NavLink } from 'react-router-dom'

export default function NavBar() {
  const { isConnected } = useWallet()
  const { account, balance, currentChain } = useAccount()
  const { isOpen, onOpen, onClose } = useModalState()

  const handleConnect = () => {
    onOpen()
  }

  return (
    <header className="flex justify-between itemcs-center max-w-[] w-full mx-auto h-20">
      <div className="flex items-center">
        <Link to="/" className="mr-3">
          <img src="/bungee-logo.svg" alt="bungee-logo" />
        </Link>
        <nav>
          <ul className="flex">
            <li className="mx-8"><Link to="/">Transfer</Link></li>
            <li className="mx-8"><Link to="/transactions">Transaction History</Link></li>
          </ul>
        </nav>
      </div>
      <div className="flex">
        {
          isConnected ? (
            <>
              <Select />
            </>
          ) : <Button variant="text" color="info" onClick={handleConnect}>Connect Wallet</Button>
        }
      </div>
    </header>
  )
}