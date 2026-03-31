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

  const containerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  }

  const itemVariants = {
    hover: { scale: 1.02, x: 4 },
    tap: { scale: 0.98 }
  }

  return (
    <>
      {/* Desktop sidebar */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="hidden md:flex fixed left-0 top-0 bottom-0 w-72 bg-white/40 backdrop-blur-xl border-r border-black/5 flex-col z-40 p-6"
      >
        {/* Logo */}
        <div className="mb-10 px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-apple-blue flex items-center justify-center shadow-apple">
              <span className="text-white text-lg font-black">M</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-apple-text">Mindly</h1>
              <p className="text-[11px] text-apple-muted font-medium tracking-wide uppercase">
                {isHR ? 'HR Intelligence' : 'Personal Space'}
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1">
          <p className="text-[11px] text-apple-muted/60 uppercase tracking-widest font-bold px-4 mb-4">Explore</p>
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              variants={itemVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[14px] font-medium transition-all ${
                currentView === item.id
                  ? 'bg-apple-blue text-white shadow-apple'
                  : 'text-apple-muted hover:text-apple-text hover:bg-black/5'
              }`}
            >
              <item.icon size={18} strokeWidth={2.5} />
              {item.label}
              {currentView === item.id && (
                <motion.div
                  layoutId="activeIndicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
                />
              )}
            </motion.button>
          ))}

          {/* Settings */}
          <div className="pt-4 mt-4 border-t border-black/5">
            <p className="text-[11px] text-apple-muted/60 uppercase tracking-widest font-bold px-4 mb-4">Account</p>
            <motion.button
              variants={itemVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => onNavigate('settings')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[14px] font-medium transition-all ${
                currentView === 'settings'
                  ? 'bg-apple-blue text-white shadow-apple'
                  : 'text-apple-muted hover:text-apple-text hover:bg-black/5'
              }`}
            >
              <Settings size={18} strokeWidth={2.5} />
              Settings
            </motion.button>
          </div>
        </nav>

        {/* User + CTA */}
        <div className="space-y-4">
          {!isHR && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onStartCheckIn}
              className="w-full bg-apple-text text-white py-3.5 rounded-2xl shadow-apple flex items-center justify-center gap-2 text-sm font-semibold hover:bg-black"
            >
              <PlusCircle size={18} />
              Daily Check-in
            </motion.button>
          )}

          <div className="p-4 rounded-3xl bg-black/5 space-y-3">
            <button
              onClick={() => onNavigate('settings')}
              className="flex items-center gap-3 w-full text-left group"
            >
              {profile?.avatarConfig ? (
                <Avatar config={profile.avatarConfig} size={40} className="rounded-2xl shadow-sm border border-black/5" />
              ) : (
                <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-sm font-bold shadow-sm border border-black/5">
                  {profile?.avatar || '?'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-apple-text truncate">{profile?.name}</p>
                <p className="text-[11px] text-apple-muted capitalize font-medium">{profile?.role}</p>
              </div>
            </button>

            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-apple-muted hover:text-mood-bad transition-colors border-t border-black/5 pt-3"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        </div>
      </motion.div>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm">
        <div className="glass shadow-apple-lg rounded-full px-6 py-3 flex items-center justify-between">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center p-2 rounded-2xl transition-all ${
                currentView === item.id ? 'text-apple-blue scale-110' : 'text-apple-muted'
              }`}
            >
              <item.icon size={22} strokeWidth={currentView === item.id ? 2.5 : 2} />
            </button>
          ))}
          {!isHR && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onStartCheckIn}
              className="w-12 h-12 bg-apple-blue rounded-full flex items-center justify-center text-white shadow-apple border-4 border-white"
            >
              <PlusCircle size={24} />
            </motion.button>
          )}
          <button
            onClick={() => onNavigate('settings')}
            className={`flex flex-col items-center p-2 rounded-2xl transition-all ${
              currentView === 'settings' ? 'text-apple-blue' : 'text-apple-muted'
            }`}
          >
            <Settings size={22} />
          </button>
        </div>
      </div>
    </>
  )
}
