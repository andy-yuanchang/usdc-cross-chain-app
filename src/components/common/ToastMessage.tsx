import useControlledValue from '@/hooks/useControlledValue';
import Alert, { type AlertProps } from '@mui/material/Alert';
import Button from '@mui/material/Button';

interface ToastMessageProps extends Omit<Partial<AlertProps>, 'onChange' | 'defaultValue'> {
  message: string
  open?: boolean
  defaultValue?: boolean
  onChange?: (val: boolean) => void
}

export default function ToastMessage({ open, defaultValue = false, onChange, message, severity, ...rest }: ToastMessageProps) {
  const [state, setState] = useControlledValue({ defaultValue, value: open, onChange })
  return (
    state ?
      <Alert className={"mt-3 overflow-hidden whitespace-pre-wrap break-all max-w-[600px] mx-auto"} severity={severity} {...rest} action={
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          onClick={() => setState(false)}
        >
          {'Close'}
        </Button>
      }>
        {message}
      </Alert> : null
  )
}
