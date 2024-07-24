import { useState, useEffect, useCallback } from 'react'

interface UseControlledValueProps<T> {
  value?: T
  defaultValue: T
  onChange?: (value: T) => void
}

export default function useControlledValue<T>({
  value,
  defaultValue,
  onChange
}: UseControlledValueProps<T>): [T, (newValue: T) => void] {
  const [internalValue, setInternalValue] = useState<T>(defaultValue)
  const isControlled = value !== undefined

  const currentValue = isControlled ? value : internalValue

  const handleChange = useCallback(
    (newValue: T) => {
      if (!isControlled) {
        setInternalValue(newValue)
      }
      if (onChange) {
        onChange(newValue)
      }
    },
    [isControlled, onChange]
  )

  useEffect(() => {
    if (isControlled) {
      setInternalValue(value as T)
    }
  }, [value, isControlled])

  return [currentValue, handleChange]
}
