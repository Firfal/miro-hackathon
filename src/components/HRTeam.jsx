import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, Search, ChevronRight, Zap, Flame, Brain, Users } from 'lucide-react'
import { moodConfig } from '../data/mockData'
import { Avatar } from './Avatar'
import { MoodFace } from './Illustrations'

export default function HRTeam({ members, onSelectMember }) {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = members.filter(m => {
    const matchesFilter = filter === 'all'
      ? true
      : filter === 'alert'
      ? (m.stress || 0) >= 7 || (m.energy || 0) <= 3
      : m.mood === filter

    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
                          m.email.toLowerCase().includes(search.toLowerCase())

    return matchesFilter && matchesSearch
  })

  const filters = [
    { id: 'all', label: 'All', icon: Users, count: members.length },
    { id: 'alert', label: 'Attention', icon: AlertCircle, count: members.filter((m) => (m.stress || 0) >= 7 || (m.energy || 0) <= 3).length },
    ...Object.entries(moodConfig).map(([key, cfg]) => ({
      id: key,
      label: cfg.label,
      count: members.filter((m) => m.mood === key).length,
    })),
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.04 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  }

  return (
    <div className="min-h-screen px-6 md:px-10 py-8 md:py-14 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-4xl md:text-5xl text-ink mb-6">Team Directory</h1>

        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" size={18} />
            <input
              type="text"
              placeholder="Search members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-11"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === f.id
                    ? 'bg-ink text-white'
                    : 'bg-white text-ink-muted hover:bg-surface-sunken border border-border-subtle'
                }`}
              >
                {f.icon && <f.icon size={14} />}
                {f.label}
                <span className={`text-[10px] font-semibold ${filter === f.id ? 'text-white/50' : 'text-ink-faint'}`}>
                  {f.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        key={filter + search}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <AnimatePresence>
          {filtered.map((m) => {
            const mood = m.mood ? moodConfig[m.mood] : null
            const isAlert = (m.stress || 0) >= 7 || (m.energy || 0) <= 3

            return (
              <motion.button
                layout
                variants={itemVariants}
                key={m.id}
                onClick={() => onSelectMember(m)}
                className={`card-flat p-5 text-left group relative flex flex-col ${
                  isAlert ? 'border-mood-bad/20' : ''
                }`}
              >
                {isAlert && (
                  <div className="absolute top-4 right-4 text-mood-bad">
                    <AlertCircle size={16} />
                  </div>
                )}

                <div className="flex items-center gap-3 mb-5">
                  {m.avatarConfig ? (
                    <Avatar config={m.avatarConfig} size={44} className="rounded-xl" />
                  ) : (
                    <div className="w-11 h-11 rounded-xl bg-surface-sunken flex items-center justify-center text-sm font-semibold text-ink border border-border-subtle">
                      {m.avatar}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-ink truncate">{m.name}</p>
                    <p className="text-xs text-ink-muted">{m.role}</p>
                  </div>
                </div>

                <div className="flex-1">
                  {mood ? (
                    <div className="space-y-4">
                      <div
                        className="rounded-xl px-3.5 py-2.5 flex items-center justify-between"
                        style={{ backgroundColor: mood.bgLight }}
                      >
                        <div className="flex items-center gap-2">
                          <MoodFace mood={m.mood} size={28} />
                          <span className="font-semibold text-sm" style={{ color: mood.color }}>{mood.label}</span>
                        </div>
                        <span className="text-[10px] font-medium text-ink-muted uppercase tracking-wider">
                          {m.checkedInToday ? 'Today' : 'Past'}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <MiniMetric label="Energy" value={m.energy} color="text-accent-teal" />
                        <MiniMetric label="Stress" value={m.stress} color="text-accent-coral" />
                        <MiniMetric label="Load" value={m.mentalLoad} color="text-accent-indigo" />
                      </div>
                    </div>
                  ) : (
                    <div className="h-28 rounded-xl bg-surface-sunken flex items-center justify-center">
                      <p className="text-xs font-medium text-ink-muted">No recent data</p>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-border-subtle flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs font-medium text-primary">View details</span>
                  <ChevronRight size={14} className="text-primary" />
                </div>
              </motion.button>
            )
          })}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24 text-ink-muted"
        >
          <Search size={32} className="mx-auto mb-4 text-ink-faint" />
          <h3 className="text-lg font-semibold text-ink mb-1">No matching members</h3>
          <p className="text-sm">Try adjusting your filters or search.</p>
        </motion.div>
      )}
    </div>
  )
}

function MiniMetric({ label, value, color }) {
  const pct = (value || 0) * 10
  return (
    <div className="text-center">
      <div className="w-full h-1 bg-surface-sunken rounded-full overflow-hidden mb-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          className={`h-full rounded-full ${color.replace('text-', 'bg-')}`}
        />
      </div>
      <p className={`font-bold text-base ${color}`}>{value || '—'}</p>
      <p className="text-[9px] font-medium text-ink-muted uppercase tracking-wider mt-0.5">{label}</p>
    </div>
  )
}
