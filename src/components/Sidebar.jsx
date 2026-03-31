import { motion } from 'framer-motion'
import { Home, Users, Calendar, Bell, History, LogOut, PlusCircle, Settings } from 'lucide-react'
import { Avatar } from './Avatar'

export default function Sidebar({ currentView, onNavigate, onStartCheckIn, profile, onLogout, isHR }) {
  const navItems = isHR
    ? [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'team', label: 'Team', icon: Users },
        { id: 'calendar', label: 'Calendar', icon: Calendar },
        { id: 'alerts', label: 'Alerts', icon: Bell },
      ]
    : [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'history', label: 'History', icon: History },
      ]

  return (
    <>
      {/* Desktop sidebar */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-border flex-col z-40 py-6 px-4"
      >
        {/* Logo */}
        <div className="mb-8 px-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-white text-base font-bold">M</span>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-ink">Mindly</h1>
              <p className="text-[10px] text-ink-muted font-medium uppercase tracking-wider">
                {isHR ? 'HR Intelligence' : 'Personal Space'}
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5">
          <p className="text-[11px] text-ink-muted uppercase tracking-wider font-medium px-3 mb-3">Menu</p>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-colors duration-150 ${
                currentView === item.id
                  ? 'bg-primary-light text-primary'
                  : 'text-ink-muted hover:text-ink hover:bg-surface-sunken'
              }`}
            >
              <item.icon size={18} strokeWidth={currentView === item.id ? 2.2 : 1.8} />
              {item.label}
            </button>
          ))}

          <div className="pt-4 mt-4 border-t border-border-subtle">
            <p className="text-[11px] text-ink-muted uppercase tracking-wider font-medium px-3 mb-3">Account</p>
            <button
              onClick={() => onNavigate('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-colors duration-150 ${
                currentView === 'settings'
                  ? 'bg-primary-light text-primary'
                  : 'text-ink-muted hover:text-ink hover:bg-surface-sunken'
              }`}
            >
              <Settings size={18} strokeWidth={currentView === 'settings' ? 2.2 : 1.8} />
              Settings
            </button>
          </div>
        </nav>

        {/* User + CTA */}
        <div className="space-y-3">
          {!isHR && (
            <button
              onClick={onStartCheckIn}
              className="w-full btn-primary py-3 flex items-center justify-center gap-2 text-sm"
            >
              <PlusCircle size={18} />
              Daily Check-in
            </button>
          )}

          <div className="p-3 rounded-xl bg-surface-sunken space-y-2.5">
            <button
              onClick={() => onNavigate('settings')}
              className="flex items-center gap-3 w-full text-left"
            >
              {profile?.avatarConfig ? (
                <Avatar config={profile.avatarConfig} size={36} className="rounded-xl" />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-sm font-semibold border border-border-subtle">
                  {profile?.avatar || '?'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink truncate">{profile?.name}</p>
                <p className="text-[11px] text-ink-muted capitalize">{profile?.role}</p>
              </div>
            </button>

            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-ink-muted hover:text-mood-bad transition-colors border-t border-border-subtle pt-2.5"
            >
              <LogOut size={13} />
              Sign out
            </button>
          </div>
        </div>
      </motion.div>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[88%] max-w-sm">
        <div className="bg-white shadow-float border border-border rounded-2xl px-4 py-2.5 flex items-center justify-between">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center p-2 rounded-xl transition-colors ${
                currentView === item.id ? 'text-primary' : 'text-ink-muted'
              }`}
            >
              <item.icon size={22} strokeWidth={currentView === item.id ? 2.2 : 1.8} />
            </button>
          ))}
          {!isHR && (
            <button
              onClick={onStartCheckIn}
              className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center text-white shadow-glow"
            >
              <PlusCircle size={22} />
            </button>
          )}
          <button
            onClick={() => onNavigate('settings')}
            className={`flex flex-col items-center p-2 rounded-xl transition-colors ${
              currentView === 'settings' ? 'text-primary' : 'text-ink-muted'
            }`}
          >
            <Settings size={22} />
          </button>
        </div>
      </div>
    </>
  )
}
