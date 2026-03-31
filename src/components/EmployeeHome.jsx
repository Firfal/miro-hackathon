import { motion } from 'framer-motion'
import { Plus, Flame, ClipboardList, Calendar, Zap, Lightbulb, ChevronRight, Activity, Brain, Waves } from 'lucide-react'
import { moodConfig } from '../data/mockData'

export default function EmployeeHome({ profile, todayCheckin, checkins, onStartCheckIn }) {
  const today = new Date()
  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  const recentCheckins = [...checkins].slice(0, 7)

  // Streak calculation
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
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
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
      className="min-h-screen px-6 md:px-12 py-8 md:py-16 max-w-5xl mx-auto"
    >
      {/* Hero greeting */}
      <motion.div variants={itemVariants} className="mb-12">
        <p className="text-sm font-bold text-apple-blue uppercase tracking-widest mb-2">{dateStr}</p>
        <h1 className="text-4xl md:text-6xl font-extrabold text-apple-text tracking-tight">
          G'day, {profile.name.split(' ')[0]}
        </h1>
        <p className="text-apple-muted text-xl font-medium mt-4">Take a moment for yourself today.</p>
      </motion.div>

      {/* Check-in status */}
      {!todayCheckin ? (
        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStartCheckIn}
          className="w-full bg-apple-text text-white rounded-[2.5rem] p-8 flex items-center justify-between group shadow-apple-lg mb-12"
        >
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-[1.8rem] bg-white/10 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
              <Plus size={32} strokeWidth={3} />
            </div>
            <div className="text-left">
              <p className="font-bold text-2xl tracking-tight">Daily Reflection</p>
              <p className="text-white/60 text-base font-medium">How's your mind today?</p>
            </div>
          </div>
          <ChevronRight className="text-white/40 group-hover:text-white transition-colors" size={32} />
        </motion.button>
      ) : (
        <motion.div variants={itemVariants} className="mb-12">
          <TodayCard checkin={todayCheckin} />
        </motion.div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard
          label="Current Streak"
          value={`${streak} days`}
          icon={Flame}
          color="text-mood-low"
          bgColor="bg-mood-low/10"
          variants={itemVariants}
        />
        <StatCard
          label="Total Insights"
          value={checkins.length}
          icon={ClipboardList}
          color="text-apple-blue"
          bgColor="bg-apple-blue/10"
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
          color="text-mood-good"
          bgColor="bg-mood-good/10"
          variants={itemVariants}
        />
        <StatCard
          label="Avg. Energy"
          value={checkins.length > 0
            ? (checkins.slice(0, 7).reduce((s, c) => s + (c.energy || 5), 0) / Math.min(7, checkins.length)).toFixed(1)
            : '—'
          }
          icon={Zap}
          color="text-mood-okay"
          bgColor="bg-mood-okay/10"
          variants={itemVariants}
        />
      </div>

      {/* Recent moods strip */}
      {recentCheckins.length > 0 && (
        <motion.div variants={itemVariants} className="mb-12">
          <h2 className="text-xl font-bold text-apple-text mb-6">Mood History</h2>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {recentCheckins.map((c, i) => {
              const mood = moodConfig[c.mood] || moodConfig.okay
              const date = new Date(c.date)
              const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
              return (
                <motion.div
                  key={c.id || i}
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center gap-3 min-w-[80px]"
                >
                  <div
                    className="w-16 h-16 rounded-[1.8rem] flex items-center justify-center text-3xl shadow-apple transition-transform"
                    style={{ backgroundColor: mood.bg }}
                  >
                    {mood.emoji}
                  </div>
                  <span className="text-xs font-bold text-apple-muted uppercase tracking-widest">{dayName}</span>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Insight card */}
      <motion.div 
        variants={itemVariants}
        whileHover={{ scale: 1.01 }}
        className="bg-gradient-to-br from-apple-blue/10 to-pastel-lavender/40 rounded-[2.5rem] p-10 flex items-start gap-8 shadow-apple-lg border border-white"
      >
        <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-apple-blue shadow-apple">
          <Lightbulb size={32} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-apple-text mb-3 tracking-tight">Daily Wisdom</h3>
          <p className="text-apple-muted text-lg font-medium leading-relaxed max-w-2xl">
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
    <div className="apple-card overflow-hidden">
       <div className="p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8" style={{ backgroundColor: mood.bgLight }}>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <motion.div 
              initial={{ scale: 0.5, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 12 }}
              className="text-7xl md:text-8xl filter drop-shadow-xl"
            >
              {mood.emoji}
            </motion.div>
            <div className="text-center md:text-left">
              <p className="text-xs font-bold text-apple-muted uppercase tracking-[0.2em] mb-2">Today's Reflection</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-apple-text tracking-tight">You're feeling {mood.label.toLowerCase()}</h2>
              <p className="text-apple-muted font-medium mt-2">Logged at {new Date(checkin.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
             <MiniStat label="Energy" value={checkin.energy} icon={Zap} color="text-mood-good" />
             <MiniStat label="Stress" value={checkin.stress} icon={Waves} color="text-mood-low" />
             <MiniStat label="Load" value={checkin.mentalLoad} icon={Brain} color="text-apple-blue" />
          </div>
       </div>
    </div>
  )
}

function MiniStat({ label, value, icon: Icon, color }) {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 flex-1 md:min-w-[120px] text-center shadow-sm border border-white">
      <div className={`flex justify-center ${color} mb-2`}>
        <Icon size={20} strokeWidth={2.5} />
      </div>
      <p className="text-2xl font-black text-apple-text leading-none">{value || '—'}</p>
      <p className="text-[10px] font-bold text-apple-muted uppercase tracking-widest mt-2">{label}</p>
    </div>
  )
}

function StatCard({ label, value, icon: Icon, color, bgColor, variants }) {
  return (
    <motion.div 
      variants={variants}
      whileHover={{ y: -5 }}
      className="apple-card p-6 flex items-center gap-5 cursor-default"
    >
      <div className={`w-12 h-12 rounded-2xl ${bgColor} flex items-center justify-center ${color} shadow-inner`}>
        <Icon size={24} strokeWidth={2.5} />
      </div>
      <div>
        <p className="text-xl font-extrabold text-apple-text tracking-tight">{value}</p>
        <p className="text-[11px] font-bold text-apple-muted uppercase tracking-widest leading-tight mt-0.5">{label}</p>
      </div>
    </motion.div>
  )
}
