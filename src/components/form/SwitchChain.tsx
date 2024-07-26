import { IMAGE_PATHS } from '@/constants'
import { getChain } from '@/utils'
import ListItemIcon from '@mui/material/ListItemIcon'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import type { SelectChangeEvent, SelectProps } from '@mui/material'
import useControlledValue from '@/hooks/useControlledValue'

interface SwitchChainProps extends Omit<SelectProps, 'defaultValue'> {
  defaultValue: string
  value?: string
  onChainChange?: (chainId: string) => void
}

export default function SwitchChain({
  value,
  defaultValue,
  onChainChange,
  ...rest
}: SwitchChainProps) {
  const [val, setVal] = useControlledValue<string>({
    value,
    defaultValue,
    onChange: onChainChange
  })

  const handleSwitchChain = (event: SelectChangeEvent<string>) => {
    setVal(event.target.value)
  }

  return (
    <Select value={val} onChange={handleSwitchChain} {...rest}>
      {Object.entries(IMAGE_PATHS).map(([id, path]) => (
        <MenuItem value={id} key={id}>
          <ListItemIcon>
            <img
              src={path}
              alt={`${getChain(+id)?.name} logo`}
              className="w-[1.5em] h-[1.5em]"
            />
          </ListItemIcon>
          {getChain(+id)?.name}
        </MenuItem>
      ))}
    </Select>
  )
}
