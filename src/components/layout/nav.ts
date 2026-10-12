import {
  Dashboard as LayoutDashboard,
  DataTransferBoth as ArrowLeftRight,
  StatsUpSquare as BarChart3,
  Trophy as Target,
  Wallet,
  Settings,
} from 'iconoir-react'
import type { IconType as LucideIcon } from '../icons'

export interface NavItem {
  label: string
  to: string
  icon: LucideIcon
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard },
  { label: 'Transactions', to: '/transactions', icon: ArrowLeftRight },
  { label: 'Budget', to: '/budget', icon: Wallet },
  { label: 'Savings Goals', to: '/goals', icon: Target },
  { label: 'Analytics', to: '/analytics', icon: BarChart3 },
]

export const BOTTOM_ITEMS: NavItem[] = [{ label: 'Settings', to: '/settings', icon: Settings }]
