import { useState } from 'react'
import { useTheme } from './useTheme'

export const useUIPreferences = () => {
  const { theme, setTheme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [devMode, setDevMode] = useState(false)

  return { theme, setTheme, sidebarOpen, setSidebarOpen, devMode, setDevMode }
}
