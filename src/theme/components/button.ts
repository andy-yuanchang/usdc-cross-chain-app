import type { ThemeOptions } from '@mui/material'

export const Button: ThemeOptions['components'] = {
  MuiButton: {
    styleOverrides: {
      root: () => ({
        background: '#3898FF',
        color: 'white'
      })
    }
  }
}
