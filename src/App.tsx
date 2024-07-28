import { walletStore } from '@/atoms/store'
import ErrorBoundary from '@/components/ErrorBoundary'
import { router } from '@/constants'
import { theme } from '@/theme'
import { createTheme, ThemeProvider } from '@mui/material'
import { Provider } from 'jotai'
import { RouterProvider } from 'react-router-dom'

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={createTheme(theme)}>
        <Provider store={walletStore}>
          <RouterProvider router={router} />
        </Provider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
