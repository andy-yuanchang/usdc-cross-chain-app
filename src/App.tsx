import { RouterProvider } from 'react-router-dom'
import ErrorBoundary from '@/components/ErrorBoundary'
import { createTheme, ThemeProvider } from '@mui/material'
import { theme } from '@/theme'
import { router } from '@/constants'

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={createTheme(theme)}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </ErrorBoundary>
  )
}
