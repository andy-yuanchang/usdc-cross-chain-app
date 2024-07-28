import { Alert, Button, Dialog, Link, OutlinedInput, Select } from './components'
import { palette } from './palette'
import { typography } from './typography'

import type { ThemeOptions } from '@mui/material'

export const theme: ThemeOptions | undefined = {
  palette,
  typography,
  components: {
    ...Dialog,
    ...Button,
    ...Link,
    ...Select,
    ...OutlinedInput,
    ...Alert
  }
}
