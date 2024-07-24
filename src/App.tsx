import { RouterProvider } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material'
import { theme } from '@/theme'
import { router } from '@/constants'
import { Provider } from 'jotai'
import { walletStore } from '@/atoms/store'

export default function App() {
  return (
    <ThemeProvider theme={createTheme(theme)}>
      <Provider store={walletStore}>
        <RouterProvider router={router} />
      </Provider>
    </ThemeProvider>
  )
}
