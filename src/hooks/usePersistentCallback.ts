import { useCallback, useRef } from 'react'

type Callback<T extends (...args: any[]) => any> = T

export default function usePersistentCallback<
  T extends (...args: any[]) => any
>(callback: Callback<T>): Callback<T> {
  const callbackRef = useRef<Callback<T>>(callback)

  callbackRef.current = callback

  return useCallback(
    ((...args: Parameters<T>): ReturnType<T> => {
      return callbackRef.current(...args)
    }) as Callback<T>,
    []
  )
}
