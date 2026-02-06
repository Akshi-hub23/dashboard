'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Zap,
  Database,
  AlertCircle,
} from 'lucide-react'

export default function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Overview', icon: Home },
    { href: '/sensors', label: 'Sensors', icon: Zap },
    { href: '/raw-data', label: 'Raw Data', icon: Database },
    { href: '/alerts', label: 'Alerts & Settings', icon: AlertCircle },
  ]

  return (
    <div className="w-56 bg-sidebar border-r border-[#007C7C] flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-[#007C7C]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#00D1D1] rounded flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <h1 className="text-lg font-bold text-white">AKSHITHA</h1>
        </div>
        <p className="text-xs text-[#E6FFFF] mt-1 font-medium">Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-[#007C7C] text-white shadow-md'
                  : 'text-[#E6FFFF] hover:bg-[#00BFBF] hover:text-white'
              }`}
            >
              <Icon 
                size={20} 
                className={`transition-colors ${
                  isActive ? 'text-white' : 'text-[#E6FFFF] group-hover:text-white'
                }`} 
              />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
