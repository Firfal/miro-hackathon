import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, AlertCircle, Search, ChevronRight, Zap, Flame, Brain, Users } from 'lucide-react'
import { moodConfig } from '../data/mockData'
import { Avatar } from './Avatar'

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
      emoji: cfg.emoji,
      count: members.filter((m) => m.mood === key).length,
    })),
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    }
  }

  return (
    <div className="min-h-screen px-6 md:px-12 py-8 md:py-16 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl md:text-6xl font-extrabold text-apple-text tracking-tight mb-8">Team Directory</h1>
        
        {/* Search & Filters Container */}
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-apple-muted" size={20} />
            <input 
              type="text" 
              placeholder="Search members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black/5 border-none rounded-2xl pl-12 pr-6 py-4 text-apple-text placeholder:text-apple-muted/40 focus:ring-4 focus:ring-apple-blue/10 transition-all font-medium"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all ${
                  filter === f.id
                    ? 'bg-apple-text text-white shadow-apple scale-105'
                    : 'bg-white text-apple-muted hover:bg-black/5 border border-black/5'
                }`}
              >
                {f.icon ? <f.icon size={16} /> : <span>{f.emoji}</span>}
                {f.label}
                <span className={`ml-1 text-[10px] font-black uppercase ${filter === f.id ? 'text-white/60' : 'text-apple-muted/40'}`}>
                  {f.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Team grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        key={filter + search}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
                className={`apple-card p-6 text-left group relative flex flex-col ${
                  isAlert ? 'border-mood-bad/20' : ''
                }`}
              >
                {isAlert && (
                  <div className="absolute top-4 right-4 text-mood-bad animate-pulse">
                    <AlertCircle size={20} strokeWidth={3} />
                  </div>
                )}

                <div className="flex items-center gap-4 mb-6">
                  {m.avatarConfig ? (
                    <Avatar config={m.avatarConfig} size={56} className="rounded-2xl shadow-sm border border-black/5 group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-apple-light to-apple-gray flex items-center justify-center text-sm font-bold text-apple-text border border-black/5 shadow-sm group-hover:scale-105 transition-transform">
                      {m.avatar}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-extrabold text-apple-text truncate text-lg tracking-tight leading-tight">{m.name}</p>
                    <p className="text-xs text-apple-muted font-semibold mt-0.5">{m.role}</p>
                  </div>
                </div>

                <div className="flex-1">
                  {mood ? (
                    <div className="space-y-6">
                      <div
                        className="rounded-2xl px-4 py-3 flex items-center justify-between"
                        style={{ backgroundColor: mood.bgLight }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{mood.emoji}</span>
                          <span className="font-bold text-sm" style={{ color: mood.color }}>{mood.label}</span>
                        </div>
                        <span className="text-[10px] font-bold text-apple-muted/60 uppercase tracking-widest">
                          {m.checkedInToday ? 'Today' : 'Past'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 px-2">
                        <MiniMetric label="Energy" value={m.energy} icon={Zap} color="text-mood-great" bgColor="bg-mood-great/20" />
                        <MiniMetric label="Stress" value={m.stress} icon={Flame} color="text-mood-low" bgColor="bg-mood-low/20" />
                        <MiniMetric label="Load" value={m.mentalLoad} icon={Brain} color="text-apple-blue" bgColor="bg-apple-blue/20" />
                      </div>
                    </div>
                  ) : (
                    <div className="h-32 rounded-2xl bg-black/5 flex flex-col items-center justify-center text-center p-6">
                       <p className="text-xs font-bold text-apple-muted uppercase tracking-widest">No recent data</p>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-4 border-t border-black/5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs font-bold text-apple-blue uppercase tracking-widest">View Deep Insights</span>
                  <ChevronRight size={16} className="text-apple-blue" />
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
          className="text-center py-32 text-apple-muted"
        >
          <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-6 text-apple-muted/30">
            <Search size={40} />
          </div>
          <h3 className="text-xl font-bold text-apple-text mb-2">No matching members</h3>
          <p className="font-medium">Try adjusting your filters or search terms.</p>
        </motion.div>
      )}
    </div>
  )
}

function MiniMetric({ label, value, icon: Icon, color, bgColor }) {
  const percentage = (value || 0) * 10
  
  return (
    <div className="flex flex-col items-center">
      <div className="w-full h-1 bg-black/5 rounded-full overflow-hidden mb-3">
         <motion.div 
           initial={{ width: 0 }}
           animate={{ width: `${percentage}%` }}
           className={`h-full rounded-full ${color.replace('text-', 'bg-')}`}
         />
      </div>
      <p className={`font-black text-lg ${color} leading-none`}>{value || '—'}</p>
      <p className="text-[9px] font-bold text-apple-muted uppercase tracking-widest mt-1.5">{label}</p>
    </div>
  )
}
