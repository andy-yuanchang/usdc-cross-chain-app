import TransactionHistory from '@/components/transactions/History'
import { type RouteObject, createBrowserRouter } from 'react-router-dom'
import AppLayout from '@/layouts/AppLayout'
import TransferForm from '@/components/form/TransferForm'

const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '',
        element: <TransferForm />
      },
      {
        path: '/transactions',
        element: <TransactionHistory />
      }
    ]
  }
]

export const router = createBrowserRouter(routes)
