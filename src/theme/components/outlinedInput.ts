import type { ThemeOptions } from '@mui/material'

export const OutlinedInput: ThemeOptions['components'] = {
  MuiOutlinedInput: {
    styleOverrides: {
      notchedOutline: {
        border: 0
      },
      input: {
        padding: 0
      }
    }
  }
}
