'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import type { Lang } from '@/lib/i18n'

/* ─── Types ─── */
export type Theme = 'dark' | 'light'

interface ThemeContextValue {
  theme: Theme
  lang: Lang
  toggleTheme: () => void
  setLang: (l: Lang) => void
}

/* ─── Context ─── */
const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  lang: 'km',
  toggleTheme: () => {},
  setLang: () => {},
})

/* ─── Provider ─── */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const [lang,  setLangState] = useState<Lang>('km')
  const [mounted, setMounted] = useState(false)

  /* Read persisted prefs on first mount */
  useEffect(() => {
    let active = true
    queueMicrotask(() => {
      if (!active) return
      let savedTheme: Theme | null = null
      let savedLang: Lang | null = null
      try {
        const themeValue = localStorage.getItem('cafe-theme')
        const langValue = localStorage.getItem('cafe-lang')
        if (themeValue === 'dark' || themeValue === 'light') savedTheme = themeValue
        if (langValue === 'en' || langValue === 'km') savedLang = langValue
      } catch {
        // Browser storage may be disabled; use system and language defaults.
      }
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(savedTheme ?? (prefersDark ? 'dark' : 'light'))
      setLangState(savedLang ?? 'km')
      setMounted(true)
    })
    return () => { active = false }
  }, [])

  /* Apply theme attr to <html> whenever it changes */
  useEffect(() => {
    if (!mounted) return
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.setAttribute('lang', lang === 'km' ? 'km' : 'en')
    try { localStorage.setItem('cafe-theme', theme) } catch { /* Storage is optional. */ }
  }, [theme, mounted, lang])

  /* Apply lang attr */
  useEffect(() => {
    if (!mounted) return
    document.documentElement.setAttribute('lang', lang === 'km' ? 'km' : 'en')
    try { localStorage.setItem('cafe-lang', lang) } catch { /* Storage is optional. */ }
  }, [lang, mounted])

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('cafe-lang', l)
        document.documentElement.setAttribute('lang', l === 'km' ? 'km' : 'en')
      } catch (err) {
        console.error('Failed to save language preference:', err)
      }
    }
  }, [])

  /* Prevent flash: render nothing until localStorage is read */
  if (!mounted) return null

  return (
    <ThemeContext.Provider value={{ theme, lang, toggleTheme, setLang }}>
      {children}
    </ThemeContext.Provider>
  )
}

/* ─── Hook ─── */
export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext)
}
