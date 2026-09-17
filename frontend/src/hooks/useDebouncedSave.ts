import { useEffect } from "react"

export default function useDebouncedSave(
  value: string,
  save: (value: string) => Promise<void>,
  enabled = true,
  delay = 1500
) {
  useEffect(() => {
    if (!enabled) return

    const timeout = setTimeout(() => {
      void save(value)
    }, delay)

    return () => clearTimeout(timeout)
  }, [value, save, enabled, delay])
}