import WalletConnector from '@/components/wallet/WalletConnector'
import TransactionHistory from '@/components/transactions/History'
import { type RouteObject, createBrowserRouter } from 'react-router-dom'
import AppLayout from '@/layouts/AppLayout'

const routes: RouteObject[] = [{
  path: '/',
  element: <AppLayout />,
  children: [{
    path: '',
    element: <WalletConnector />
  }, {
    path: '/transactions',
    element: <TransactionHistory />
  }]
}]

export const router = createBrowserRouter(routes)