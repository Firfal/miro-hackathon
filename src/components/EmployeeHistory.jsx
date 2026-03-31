import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Zap, Flame, ClipboardList, TrendingUp } from 'lucide-react'
import { moodConfig } from '../data/mockData'
import { MoodFace } from './Illustrations'

export default function EmployeeHistory({ checkins }) {
  const [monthOffset, setMonthOffset] = useState(0)
  const today = new Date()
  const viewDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1)
  const monthName = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const checkinMap = {}
  checkins.forEach((c) => { checkinMap[c.date] = c })

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    cells.push({ day: d, date: dateStr, checkin: checkinMap[dateStr] || null })
  }

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

  const moodCounts = {}
  monthCheckins.forEach((c) => { moodCounts[c.mood] = (moodCounts[c.mood] || 0) + 1 })
  const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]
  const topMoodCfg = topMood ? moodConfig[topMood[0]] : null

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.1 }
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
      className="min-h-screen px-6 md:px-10 py-8 md:py-14 max-w-5xl mx-auto"
    >
      <motion.div variants={itemVariants} className="mb-10">
        <h1 className="font-display text-4xl md:text-5xl text-ink mb-1">Reflections</h1>
        <p className="text-ink-muted text-base">Your journey to mental awareness.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <motion.div variants={itemVariants} className="lg:col-span-2 card-flat p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-semibold text-ink">{monthName}</h2>
            <div className="flex gap-1.5">
              <button
                onClick={() => setMonthOffset(monthOffset - 1)}
                className="w-9 h-9 rounded-lg bg-surface-sunken hover:bg-border flex items-center justify-center text-ink transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => monthOffset < 0 && setMonthOffset(monthOffset + 1)}
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                  monthOffset >= 0 ? 'text-ink-faint cursor-not-allowed' : 'bg-surface-sunken hover:bg-border text-ink'
                }`}
                disabled={monthOffset >= 0}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-3">
            {dayNames.map((d) => (
              <div key={d} className="text-center text-[10px] font-medium text-ink-muted uppercase tracking-wider py-1">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
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
                  <span className="absolute top-1 left-1.5 text-[9px] font-medium text-ink-muted/50">{cell.day}</span>
                  {mood && <MoodFace mood={c.mood} size={24} />}
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

        {/* Sidebar */}
        <div className="space-y-4">
          <motion.div variants={itemVariants} className="card-flat p-6">
            <h3 className="text-base font-semibold text-ink mb-5">Monthly Summary</h3>

            <div className="space-y-3">
              {topMoodCfg ? (
                <div className="rounded-xl p-4 flex items-center gap-3" style={{ backgroundColor: topMoodCfg.bgLight }}>
                  <MoodFace mood={topMood[0]} size={40} />
                  <div>
                    <p className="font-semibold text-ink">{topMoodCfg.label}</p>
                    <p className="text-xs text-ink-muted">{topMood[1]} reflections</p>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl p-5 bg-surface-sunken text-center text-ink-muted text-sm">
                  Check in more to see your summary.
                </div>
              )}

              <SummaryRow label="Avg. Energy" value={avgEnergy} icon={Zap} color="text-accent-teal" bgColor="bg-pastel-green" />
              <SummaryRow label="Avg. Stress" value={avgStress} icon={Flame} color="text-accent-coral" bgColor="bg-primary-light" />
              <SummaryRow label="Check-ins" value={monthCheckins.length} icon={ClipboardList} color="text-accent-indigo" bgColor="bg-secondary-light" />
            </div>
          </motion.div>

          {monthCheckins.length > 0 && (
            <motion.div variants={itemVariants} className="card-flat p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={16} className="text-accent-teal" />
                <p className="text-xs font-medium text-ink-muted uppercase tracking-wider">Energy Trend</p>
              </div>
              <div className="flex items-end gap-1 h-20">
                {monthCheckins.slice().reverse().map((c, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${(c.energy || 5) * 10}%` }}
                    transition={{ duration: 0.6, delay: i * 0.03 }}
                    className="flex-1 rounded-t-md bg-accent-teal/20 hover:bg-accent-teal/50 transition-colors"
                    title={`${c.date}: ${c.energy}`}
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
    <div className="flex items-center justify-between p-3 bg-surface-sunken rounded-xl">
      <div className="flex items-center gap-2.5">
        <div className={`w-7 h-7 rounded-lg ${bgColor} flex items-center justify-center ${color}`}>
          <Icon size={14} />
        </div>
        <span className="text-sm font-medium text-ink">{label}</span>
      </div>
      <span className="text-base font-bold text-ink">{value}</span>
    </div>
  )
}
