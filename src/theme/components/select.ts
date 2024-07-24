import type { ThemeOptions } from '@mui/material'

export const Select: ThemeOptions['components'] = {
  MuiSelect: {
    styleOverrides: {
      outlined: () => ({
        display: 'flex',
        alignItems: 'center',
        height: '40px'
      })
    }
  }
}
