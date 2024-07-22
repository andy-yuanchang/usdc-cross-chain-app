import type { ThemeOptions } from '@mui/material'

export const Dialog: ThemeOptions['components'] = {
  MuiDialog: {
    styleOverrides: {
      root: () => ({
        zIndex: 88
      }),
    },
  },
}