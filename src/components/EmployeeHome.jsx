import { motion } from 'framer-motion'
import { Plus, Flame, ClipboardList, Calendar, Zap, Lightbulb, ChevronRight, Brain, Waves } from 'lucide-react'
import { moodConfig } from '../data/mockData'
import { MoodFace } from './Illustrations'

export default function EmployeeHome({ profile, todayCheckin, checkins, onStartCheckIn }) {
  const today = new Date()
  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  const recentCheckins = [...checkins].slice(0, 7)

  let streak = 0
  const sortedByDate = [...checkins].sort((a, b) => b.date.localeCompare(a.date))
  for (let i = 0; i < sortedByDate.length; i++) {
    const expected = new Date(today)
    expected.setDate(expected.getDate() - i)
    const expectedStr = expected.toISOString().split('T')[0]
    if (sortedByDate[i]?.date === expectedStr) streak++
    else break
  }

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
      className="min-h-screen px-6 md:px-10 py-8 md:py-14 max-w-4xl mx-auto"
    >
      {/* Greeting */}
      <motion.div variants={itemVariants} className="mb-10">
        <p className="text-sm font-medium text-primary tracking-wide mb-1">{dateStr}</p>
        <h1 className="font-display text-4xl md:text-5xl text-ink leading-tight">
          Hello, {profile.name.split(' ')[0]}
        </h1>
        <p className="text-ink-muted text-lg mt-2">Take a moment for yourself today.</p>
      </motion.div>

      {/* Check-in CTA or Today card */}
      {!todayCheckin ? (
        <motion.button
          variants={itemVariants}
          whileTap={{ scale: 0.98 }}
          onClick={onStartCheckIn}
          className="w-full bg-ink text-white rounded-2xl p-6 md:p-8 flex items-center justify-between group shadow-elevated mb-10 hover:bg-ink-light transition-colors"
        >
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
              <Plus size={24} strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <p className="font-semibold text-xl tracking-tight">Daily Reflection</p>
              <p className="text-white/50 text-sm">How's your mind today?</p>
            </div>
          </div>
          <ChevronRight className="text-white/30 group-hover:text-white/60 transition-colors" size={24} />
        </motion.button>
      ) : (
        <motion.div variants={itemVariants} className="mb-10">
          <TodayCard checkin={todayCheckin} />
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard
          label="Current Streak"
          value={`${streak}d`}
          icon={Flame}
          color="text-accent-coral"
          bgColor="bg-primary-light"
          variants={itemVariants}
        />
        <StatCard
          label="Total Check-ins"
          value={checkins.length}
          icon={ClipboardList}
          color="text-accent-indigo"
          bgColor="bg-secondary-light"
          variants={itemVariants}
        />
        <StatCard
          label="This Week"
          value={checkins.filter(c => {
            const d = new Date(c.date)
            const weekAgo = new Date(today)
            weekAgo.setDate(weekAgo.getDate() - 7)
            return d >= weekAgo
          }).length}
          icon={Calendar}
          color="text-accent-teal"
          bgColor="bg-pastel-green"
          variants={itemVariants}
        />
        <StatCard
          label="Avg. Energy"
          value={checkins.length > 0
            ? (checkins.slice(0, 7).reduce((s, c) => s + (c.energy || 5), 0) / Math.min(7, checkins.length)).toFixed(1)
            : '—'
          }
          icon={Zap}
          color="text-accent-amber"
          bgColor="bg-pastel-yellow"
          variants={itemVariants}
        />
      </div>

      {/* Recent moods */}
      {recentCheckins.length > 0 && (
        <motion.div variants={itemVariants} className="mb-10">
          <h2 className="text-lg font-semibold text-ink mb-4">Recent mood</h2>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {recentCheckins.map((c, i) => {
              const mood = moodConfig[c.mood] || moodConfig.okay
              const date = new Date(c.date)
              const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
              return (
                <div key={c.id || i} className="flex flex-col items-center gap-2 min-w-[72px]">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: mood.bg }}
                  >
                    <MoodFace mood={c.mood} size={36} />
                  </div>
                  <span className="text-[11px] font-medium text-ink-muted">{dayName}</span>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Insight */}
      <motion.div
        variants={itemVariants}
        className="card-flat p-6 md:p-8 flex items-start gap-5 bg-pastel-lavender/40"
      >
        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-accent-plum shrink-0">
          <Lightbulb size={20} />
        </div>
        <div>
          <h3 className="text-base font-semibold text-ink mb-1">Daily Wisdom</h3>
          <p className="text-ink-muted text-sm leading-relaxed">
            Pattern recognition is the first step to personal growth.
            By checking in daily, you're building a more resilient, self-aware version of yourself.
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

function TodayCard({ checkin }) {
  const mood = moodConfig[checkin.mood] || moodConfig.okay

  return (
    <div className="card-flat overflow-hidden">
      <div className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6" style={{ backgroundColor: mood.bgLight }}>
        <div className="flex items-center gap-6">
          <MoodFace mood={checkin.mood} size={64} />
          <div>
            <p className="text-[11px] font-medium text-ink-muted uppercase tracking-wider mb-1">Today's Reflection</p>
            <h2 className="text-2xl font-bold text-ink tracking-tight">You're feeling {mood.label.toLowerCase()}</h2>
            <p className="text-ink-muted text-sm mt-1">
              Logged at {new Date(checkin.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <MiniStat label="Energy" value={checkin.energy} icon={Zap} color="text-accent-teal" />
          <MiniStat label="Stress" value={checkin.stress} icon={Waves} color="text-accent-coral" />
          <MiniStat label="Load" value={checkin.mentalLoad} icon={Brain} color="text-accent-indigo" />
        </div>
      </div>
    </div>
  )
}

function MiniStat({ label, value, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-xl p-4 flex-1 md:min-w-[100px] text-center border border-border-subtle">
      <div className={`flex justify-center ${color} mb-1.5`}>
        <Icon size={16} />
      </div>
      <p className="text-xl font-bold text-ink">{value || '—'}</p>
      <p className="text-[10px] font-medium text-ink-muted uppercase tracking-wider mt-1">{label}</p>
    </div>
  )
}

function StatCard({ label, value, icon: Icon, color, bgColor, variants }) {
  return (
    <motion.div
      variants={variants}
      className="card-flat p-5 flex items-center gap-4"
    >
      <div className={`w-10 h-10 rounded-lg ${bgColor} flex items-center justify-center ${color}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-lg font-bold text-ink tracking-tight">{value}</p>
        <p className="text-[11px] font-medium text-ink-muted uppercase tracking-wider">{label}</p>
      </div>
    </motion.div>
  )
}
