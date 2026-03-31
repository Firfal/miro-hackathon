import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Zap, Flame, ClipboardList, TrendingUp, Calendar as CalendarIcon } from 'lucide-react'
import { moodConfig } from '../data/mockData'

export default function EmployeeHistory({ checkins }) {
  const [monthOffset, setMonthOffset] = useState(0)
  const today = new Date()
  const viewDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1)
  const monthName = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  // Map checkins by date
  const checkinMap = {}
  checkins.forEach((c) => { checkinMap[c.date] = c })

  // Build calendar grid
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    cells.push({ day: d, date: dateStr, checkin: checkinMap[dateStr] || null })
  }

  // Monthly stats
  const monthCheckins = checkins.filter((c) => {
    const d = new Date(c.date)
    return d.getMonth() === month && d.getFullYear() === year
  })
  const avgEnergy = monthCheckins.length > 0
    ? (monthCheckins.reduce((s, c) => s + (c.energy || 0), 0) / monthCheckins.length).toFixed(1)
    : '—'
  const avgStress = monthCheckins.length > 0
    ? (monthCheckins.reduce((s, c) => s + (c.stress || 0), 0) / monthCheckins.length).toFixed(1)
    : '—'

  // Dominant mood
  const moodCounts = {}
  monthCheckins.forEach((c) => { moodCounts[c.mood] = (moodCounts[c.mood] || 0) + 1 })
  const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]
  const topMoodCfg = topMood ? moodConfig[topMood[0]] : null

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
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
      className="min-h-screen px-6 md:px-12 py-8 md:py-16 max-w-6xl mx-auto"
    >
      <motion.div variants={itemVariants} className="mb-12">
        <h1 className="text-4xl md:text-6xl font-extrabold text-apple-text tracking-tight mb-2">Reflections</h1>
        <p className="text-apple-muted text-lg font-medium">Your journey to mental awareness.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <motion.div variants={itemVariants} className="lg:col-span-2 apple-card p-8 md:p-10">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold text-apple-text tracking-tight">{monthName}</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setMonthOffset(monthOffset - 1)}
                className="w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-apple-text transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => monthOffset < 0 && setMonthOffset(monthOffset + 1)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  monthOffset >= 0 ? 'text-black/10 cursor-not-allowed bg-transparent' : 'bg-black/5 hover:bg-black/10 text-apple-text'
                }`}
                disabled={monthOffset >= 0}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-4 mb-4">
            {dayNames.map((d) => (
              <div key={d} className="text-center text-[10px] font-bold text-apple-muted uppercase tracking-[0.2em] py-2">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar cells */}
          <div className="grid grid-cols-7 gap-3">
            {cells.map((cell, idx) => {
              if (!cell) return <div key={`e-${idx}`} />
              const c = cell.checkin
              const mood = c ? moodConfig[c.mood] : null
              const isToday = cell.day === today.getDate() && month === today.getMonth() && year === today.getFullYear()

              return (
                <motion.div
                  key={cell.date}
                  whileHover={mood ? { scale: 1.05 } : {}}
                  className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-all shadow-sm border border-black/5 ${
                    isToday ? 'ring-2 ring-apple-blue ring-offset-2' : ''
                  }`}
                  style={{ backgroundColor: mood ? mood.bg : '#FBFBFD' }}
                >
                  <span className="absolute top-1.5 left-2 text-[9px] font-bold text-apple-muted/60">{cell.day}</span>
                  {mood && <span className="text-2xl md:text-3xl drop-shadow-sm">{mood.emoji}</span>}
                </motion.div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="mt-10 flex flex-wrap gap-4 justify-center border-t border-black/5 pt-8">
            {Object.entries(moodConfig).map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cfg.color }} />
                <span className="text-xs font-bold text-apple-muted">{cfg.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Monthly summary sidebar */}
        <div className="space-y-6">
          <motion.div variants={itemVariants} className="apple-card p-8">
            <h3 className="text-xl font-bold text-apple-text mb-6 tracking-tight">Monthly Health</h3>

            <div className="space-y-4">
              {topMoodCfg ? (
                <div className="rounded-[2rem] p-6 flex flex-col items-center text-center shadow-inner" style={{ backgroundColor: topMoodCfg.bgLight }}>
                  <p className="text-[10px] font-bold text-apple-muted uppercase tracking-[0.2em] mb-4">Dominant Mood</p>
                  <div className="flex items-center gap-4">
                    <span className="text-5xl">{topMoodCfg.emoji}</span>
                    <div className="text-left">
                      <p className="font-extrabold text-apple-text text-xl">{topMoodCfg.label}</p>
                      <p className="text-sm font-medium text-apple-muted">{topMood[1]} reflections</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-[2rem] p-8 bg-black/5 text-center text-apple-muted text-sm font-medium">
                  Gather more insights to see your monthly summary.
                </div>
              )}

              <SummaryRow label="Avg. Vitality" value={avgEnergy} icon={Zap} color="text-mood-good" bgColor="bg-mood-good/10" />
              <SummaryRow label="Stress Level" value={avgStress} icon={Flame} color="text-mood-low" bgColor="bg-mood-low/10" />
              <SummaryRow label="Reflections" value={monthCheckins.length} icon={ClipboardList} color="text-apple-blue" bgColor="bg-apple-blue/10" />
            </div>
          </motion.div>

          {/* Mini bar chart */}
          {monthCheckins.length > 0 && (
            <motion.div variants={itemVariants} className="apple-card p-8">
               <div className="flex items-center gap-2 mb-6">
                  <TrendingUp size={18} className="text-mood-great" />
                  <p className="text-sm font-bold text-apple-text tracking-tight uppercase tracking-widest text-[10px]">Vitality Trend</p>
               </div>
              <div className="flex items-end gap-1.5 h-24 px-2">
                {monthCheckins.slice().reverse().map((c, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${(c.energy || 5) * 10}%` }}
                    transition={{ duration: 1, delay: i * 0.05 }}
                    className="flex-1 rounded-t-full bg-mood-great/30 hover:bg-mood-great transition-colors cursor-help"
                    title={`${c.date}: Energy ${c.energy}`}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function SummaryRow({ label, value, icon: Icon, color, bgColor }) {
  return (
    <div className="flex items-center justify-between p-4 bg-black/5 rounded-2xl hover:bg-black/10 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg ${bgColor} flex items-center justify-center ${color}`}>
          <Icon size={16} strokeWidth={2.5} />
        </div>
        <span className="text-sm font-bold text-apple-text">{label}</span>
      </div>
      <span className="text-lg font-black text-apple-text">{value}</span>
    </div>
  )
}
