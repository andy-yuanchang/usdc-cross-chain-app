import type { ThemeOptions } from '@mui/material'

export const Link: ThemeOptions['components'] = {
  MuiLink: {
    styleOverrides: {
      root: () => ({
        color: 'white',
        textTransform: 'capitalize'
      })
    }
  }
}
