'use client'

import React, { useEffect } from 'react'
import { useThemeStore } from '@/store/useThemeStore'

interface ThemeProviderProps {
  children: React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { hydrate } = useThemeStore()

  useEffect(() => {
    hydrate()
  }, [hydrate])

  return <>{children}</>
}

