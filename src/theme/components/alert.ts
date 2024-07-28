import type { ThemeOptions } from '@mui/material'

export const Alert: ThemeOptions['components'] = {
  MuiAlert: {
    styleOverrides: {
      action: () => ({
        alignItems: 'flex-end'
      })
    }
  }
}
