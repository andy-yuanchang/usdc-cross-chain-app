import { palette } from './palette'
import { Dialog, Button, Link, Select, OutlinedInput } from './components'
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
    ...OutlinedInput
  }
}
