import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, User } from 'lucide-react'
import { moodConfig } from '../data/mockData'
import { Avatar } from './Avatar'
import { MoodFace } from './Illustrations'

export default function HRCalendar({ members }) {
  const [selectedMember, setSelectedMember] = useState(members[0] || null)
  const [monthOffset, setMonthOffset] = useState(0)
  const today = new Date()
  const viewDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1)
  const monthName = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const checkinMap = {}
  if (selectedMember) {
    (selectedMember.checkins || []).forEach((c) => { checkinMap[c.date] = c })
  }

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    cells.push({ day: d, date: dateStr, checkin: checkinMap[dateStr] || null })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen px-6 md:px-10 py-8 md:py-14 max-w-6xl mx-auto"
    >
      <motion.div variants={itemVariants} className="mb-10">
        <h1 className="font-display text-4xl md:text-5xl text-ink mb-1">Pulse Calendar</h1>
        <p className="text-ink-muted text-base">Track individual wellness journeys over time.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Member selector */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <div className="card-flat p-3 sticky top-8 max-h-[calc(100vh-180px)] flex flex-col">
            <p className="text-[11px] font-medium text-ink-muted uppercase tracking-wider px-3 py-3 border-b border-border-subtle mb-2">
              Team Members
            </p>
            <div className="overflow-y-auto no-scrollbar space-y-0.5 pr-1">
              {members.map((m) => {
                const isActive = selectedMember?.id === m.id
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMember(m)}
                    className={`w-full flex items-center gap-2.5 px-3 py-3 rounded-xl text-left transition-colors ${
                      isActive ? 'bg-primary text-white' : 'hover:bg-surface-sunken'
                    }`}
                  >
                    {m.avatarConfig ? (
                      <Avatar config={m.avatarConfig} size={32} className={`rounded-lg ${isActive ? 'border border-white/20' : 'border border-border-subtle'}`} />
                    ) : (
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-surface-sunken text-ink border border-border-subtle'
                      }`}>
                        {m.avatar}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm truncate ${isActive ? 'text-white' : 'text-ink'}`}>{m.name}</p>
                      <p className={`text-[10px] truncate ${isActive ? 'text-white/50' : 'text-ink-muted'}`}>{m.role}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Calendar */}
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {selectedMember ? (
              <motion.div
                key={selectedMember.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="card-flat p-6 md:p-10"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                  <div>
                    <h2 className="text-2xl font-semibold text-ink">{monthName}</h2>
                    <p className="text-sm font-medium text-ink-muted mt-1">{selectedMember.name}'s history</p>
                  </div>

                  <div className="flex gap-1.5 bg-surface-sunken p-1 rounded-xl">
                    <button
                      onClick={() => setMonthOffset(monthOffset - 1)}
                      className="w-10 h-10 rounded-lg bg-white hover:bg-border flex items-center justify-center text-ink shadow-soft transition-colors"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() => monthOffset < 0 && setMonthOffset(monthOffset + 1)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                        monthOffset >= 0 ? 'text-ink-faint cursor-not-allowed' : 'bg-white hover:bg-border text-ink shadow-soft'
                      }`}
                      disabled={monthOffset >= 0}
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-3 mb-4">
                  {dayNames.map((d) => (
                    <div key={d} className="text-center text-[10px] font-medium text-ink-muted uppercase tracking-wider">
                      {d}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-3">
                  {cells.map((cell, idx) => {
                    if (!cell) return <div key={`e-${idx}`} />
                    const c = cell.checkin
                    const mood = c ? moodConfig[c.mood] : null
                    const isToday = cell.day === today.getDate() && month === today.getMonth() && year === today.getFullYear()

                    return (
                      <div
                        key={cell.date}
                        className={`aspect-square rounded-xl flex flex-col items-center justify-center relative border transition-colors ${
                          isToday ? 'ring-2 ring-primary ring-offset-2' : ''
                        } ${mood ? 'border-transparent' : 'border-border-subtle'}`}
                        style={{ backgroundColor: mood ? mood.bg : '#FAF8F5' }}
                      >
                        <span className="absolute top-1.5 left-2 text-[9px] font-medium text-ink-muted/40">{cell.day}</span>
                        {mood && <MoodFace mood={c.mood} size={26} />}
                      </div>
                    )
                  })}
                </div>

                <div className="mt-8 flex flex-wrap gap-4 justify-center border-t border-border-subtle pt-6">
                  {Object.entries(moodConfig).map(([key, cfg]) => (
                    <div key={key} className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cfg.color }} />
                      <span className="text-[11px] font-medium text-ink-muted">{cfg.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="card-flat p-16 text-center text-ink-muted">
                <User size={32} className="mx-auto mb-3 text-ink-faint" />
                <h3 className="text-lg font-semibold text-ink mb-1">Select a member</h3>
                <p className="text-sm">Choose someone to view their wellness history.</p>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  )
}
