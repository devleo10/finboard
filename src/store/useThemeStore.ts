'use client'

import { create } from 'zustand'

type Theme = 'light' | 'dark'

interface ThemeStore {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  hydrate: () => void
}

const THEME_STORAGE_KEY = 'finboard-theme'

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: 'dark',

  setTheme: (theme) => {
    set({ theme })
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_STORAGE_KEY, theme)
      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add(theme)
    }
  },

  toggleTheme: () => {
    const currentTheme = get().theme
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
    get().setTheme(newTheme)
  },

  hydrate: () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const theme = stored || (prefersDark ? 'dark' : 'dark') // Default to dark
      set({ theme })
      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add(theme)
    }
  },
}))

