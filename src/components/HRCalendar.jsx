import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, User, Calendar as CalendarIcon, Info } from 'lucide-react'
import { moodConfig } from '../data/mockData'
import { Avatar } from './Avatar'

export default function HRCalendar({ members }) {
  const [selectedMember, setSelectedMember] = useState(members[0] || null)
  const [monthOffset, setMonthOffset] = useState(0)
  const today = new Date()
  const viewDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1)
  const monthName = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  // Map checkins by date
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
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen px-6 md:px-12 py-8 md:py-16 max-w-7xl mx-auto"
    >
      <motion.div variants={itemVariants} className="mb-12">
        <h1 className="text-4xl md:text-6xl font-extrabold text-apple-text tracking-tight mb-4">Pulse Calendar</h1>
        <p className="text-apple-muted text-xl font-medium">Track individual wellness journeys over time.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Member selector */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <div className="apple-card p-4 sticky top-8 max-h-[calc(100vh-200px)] flex flex-col">
            <p className="text-[10px] font-black text-apple-muted uppercase tracking-[0.2em] px-4 py-4 border-b border-black/5 mb-2">Team Members</p>
            <div className="overflow-y-auto no-scrollbar space-y-1 pr-1">
              {members.map((m) => {
                const mood = m.mood ? moodConfig[m.mood] : null
                const isActive = selectedMember?.id === m.id
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMember(m)}
                    className={`w-full flex items-center gap-3 px-4 py-4 rounded-[1.5rem] text-left transition-all group ${
                      isActive ? 'bg-apple-blue text-white shadow-apple' : 'hover:bg-black/5'
                    }`}
                  >
                    {m.avatarConfig ? (
                      <Avatar config={m.avatarConfig} size={40} className={`rounded-xl shadow-sm border ${isActive ? 'border-white/10' : 'border-black/5'}`} />
                    ) : (
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm border border-black/5 ${isActive ? 'bg-white/20 border-white/10' : 'bg-white'}`}>
                        {mood ? mood.emoji : <User size={18} className="text-apple-muted" />}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={`font-bold text-sm truncate ${isActive ? 'text-white' : 'text-apple-text'}`}>{m.name}</p>
                      <p className={`text-[10px] font-medium truncate ${isActive ? 'text-white/60' : 'text-apple-muted'}`}>{m.role}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Calendar Content */}
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {selectedMember ? (
              <motion.div 
                key={selectedMember.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="apple-card p-8 md:p-12"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                  <div>
                    <h2 className="text-3xl font-extrabold text-apple-text tracking-tight">{monthName}</h2>
                    <div className="flex items-center gap-2 mt-2">
                       <div className="w-2 h-2 rounded-full bg-apple-blue" />
                       <p className="text-sm font-bold text-apple-muted uppercase tracking-widest">{selectedMember.name}'s History</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 bg-black/5 p-1.5 rounded-2xl">
                    <button
                      onClick={() => setMonthOffset(monthOffset - 1)}
                      className="w-12 h-12 rounded-xl bg-white hover:bg-apple-light flex items-center justify-center text-apple-text shadow-sm transition-all active:scale-95"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={() => monthOffset < 0 && setMonthOffset(monthOffset + 1)}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all active:scale-95 ${
                        monthOffset >= 0 ? 'text-apple-muted/30 bg-transparent cursor-not-allowed' : 'bg-white hover:bg-apple-light text-apple-text shadow-sm'
                      }`}
                      disabled={monthOffset >= 0}
                    >
                      <ChevronRight size={24} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-4 mb-6">
                  {dayNames.map((d) => (
                    <div key={d} className="text-center text-[10px] font-black text-apple-muted uppercase tracking-[0.2em]">
                      {d}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-4">
                  {cells.map((cell, idx) => {
                    if (!cell) return <div key={`e-${idx}`} />
                    const c = cell.checkin
                    const mood = c ? moodConfig[c.mood] : null
                    const isToday = cell.day === today.getDate() && month === today.getMonth() && year === today.getFullYear()

                    return (
                      <motion.div
                        key={cell.date}
                        whileHover={c ? { scale: 1.05, y: -2 } : {}}
                        className={`aspect-square rounded-[1.5rem] flex flex-col items-center justify-center relative transition-all border border-black/5 shadow-sm ${
                          isToday ? 'ring-2 ring-apple-blue ring-offset-4' : ''
                        }`}
                        style={{ backgroundColor: mood ? mood.bg : '#FBFBFD' }}
                      >
                        <span className="absolute top-2 left-3 text-[10px] font-bold text-apple-muted/40">{cell.day}</span>
                        {mood && <span className="text-3xl drop-shadow-sm">{mood.emoji}</span>}
                        {c && (
                           <div className="absolute bottom-2 flex gap-0.5">
                              <div className="w-1 h-1 rounded-full bg-apple-blue/20" />
                              <div className="w-1 h-1 rounded-full bg-apple-blue/20" />
                           </div>
                        )}
                      </motion.div>
                    )
                  })}
                </div>

                <div className="mt-12 flex flex-wrap gap-6 justify-center border-t border-black/5 pt-10">
                  {Object.entries(moodConfig).map(([key, cfg]) => (
                    <div key={key} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cfg.color }} />
                      <span className="text-xs font-bold text-apple-muted uppercase tracking-widest">{cfg.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="apple-card p-20 text-center text-apple-muted">
                <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-6 text-apple-muted/30">
                  <User size={40} />
                </div>
                <h3 className="text-xl font-bold text-apple-text mb-2">Select a member</h3>
                <p className="font-medium">Choose someone from the directory to view their wellness history.</p>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  )
}
