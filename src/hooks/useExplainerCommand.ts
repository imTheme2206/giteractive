import { useEffect, useRef, useState } from 'react'
import { getCommandType } from '../moduleConfig'
import type { TickerData } from '../types'

export const useExplainerCommand = (ticker: TickerData) => {
  const [explainerCommand, setExplainerCommand] = useState<string | null>(null)
  const explainerKeyRef = useRef(0)
  const seenCommandTypesRef = useRef(new Set<string>())

  useEffect(() => {
    if (ticker.state === 'flash' && ticker.command && !explainerCommand) {
      const type = getCommandType(ticker.command)
      if (type && !seenCommandTypesRef.current.has(type)) {
        seenCommandTypesRef.current.add(type)
        explainerKeyRef.current += 1
        setExplainerCommand(ticker.command)
      }
    }
  }, [ticker.state, ticker.command])

  return {
    explainerCommand,
    explainerKey: explainerKeyRef.current,
    dismissExplainer: () => setExplainerCommand(null),
  }
}
