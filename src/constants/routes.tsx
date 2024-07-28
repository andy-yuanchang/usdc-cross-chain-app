import TransferForm from '@/components/form/TransferForm';
import TransactionHistory from '@/components/transactions/History';
import AppLayout from '@/layouts/AppLayout';
import { type RouteObject, createBrowserRouter, useRouteError } from 'react-router-dom';

function ErrorBoundary() {
  const error = useRouteError();
  // rethrow to let the parent error boundary handle it
  // when it's not a special case for this route
  throw error;
}

const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    // @ts-ignore
    errorElement: <ErrorBoundary />,
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
