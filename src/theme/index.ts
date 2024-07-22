import { palette } from './palette'
import { Dialog, Button } from './components'

import type { ThemeOptions } from '@mui/material'

export const theme: ThemeOptions | undefined = {
  palette,
  components: {
    ...Dialog,
    ...Button
  }
}
