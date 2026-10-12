import { Computer as Monitor, HalfMoon as Moon, SunLight as Sun } from 'iconoir-react'
import { useTheme, type ThemePref } from '../context/ThemeContext'

const ORDER: ThemePref[] = ['light', 'dark', 'system']

export function ThemeToggle() {
  const { pref, setPref } = useTheme()

  function next() {
    const idx = ORDER.indexOf(pref)
    setPref(ORDER[(idx + 1) % ORDER.length])
  }

  const icon =
    pref === 'light' ? <Sun className="h-5 w-5" /> : pref === 'dark' ? <Moon className="h-5 w-5" /> : <Monitor className="h-5 w-5" />
  const label = pref === 'light' ? 'Light theme' : pref === 'dark' ? 'Dark theme' : 'System theme'

  return (
    <button
      onClick={next}
      title={`${label} — click to change`}
      aria-label={`Theme: ${label}. Click to change.`}
      className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
    >
      {icon}
    </button>
  )
}
