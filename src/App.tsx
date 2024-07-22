import WalletConnector from '@/components/wallet/WalletConnector'
import AppLayout from '@/layouts/AppLayout'
import ErrorBoundary from '@/components/ErrorBoundary'
import { createTheme, ThemeProvider } from '@mui/material'
import { theme } from '@/theme'

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={createTheme(theme)}>
        <AppLayout>
          <WalletConnector />
        </AppLayout>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
