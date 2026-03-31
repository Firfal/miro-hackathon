import { motion } from 'framer-motion'
import { ChevronLeft, Zap, Flame, Brain, TrendingUp, TrendingDown, Calendar, Mail, User } from 'lucide-react'
import { moodConfig } from '../data/mockData'
import { Avatar } from './Avatar'
import { MoodFace } from './Illustrations'

export default function HREmployeeDetail({ member, onBack }) {
  const mood = member.mood ? moodConfig[member.mood] : null
  const checkins = member.checkins || []
  const recent = [...checkins].slice(0, 14)

  const last7 = checkins.slice(0, 7)
  const prev7 = checkins.slice(7, 14)
  const trend = (field) => {
    if (last7.length === 0) return null
    const avg1 = last7.reduce((s, c) => s + (c[field] || 0), 0) / last7.length
    const avg2 = prev7.length > 0 ? prev7.reduce((s, c) => s + (c[field] || 0), 0) / prev7.length : avg1
    return avg1 - avg2
  }

  const energyTrend = trend('energy')
  const stressTrend = trend('stress')
  const loadTrend = trend('mentalLoad')

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.05 }
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
      <motion.button
        variants={itemVariants}
        onClick={onBack}
        className="flex items-center gap-1.5 text-ink-muted hover:text-ink mb-10 text-sm font-medium transition-colors group"
      >
        <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to Directory
      </motion.button>

      {/* Profile Card */}
      <motion.div
        variants={itemVariants}
        className="card-flat overflow-hidden mb-10"
      >
        <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6" style={{ backgroundColor: mood ? mood.bgLight : '#FAF8F5' }}>
          <div className="flex items-center gap-6">
            {member.avatarConfig ? (
              <Avatar config={member.avatarConfig} size={72} className="rounded-2xl border border-border-subtle" />
            ) : (
              <div className="w-[72px] h-[72px] rounded-2xl bg-white flex items-center justify-center text-xl font-semibold text-ink border border-border-subtle">
                {member.avatar || <User size={32} />}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-ink tracking-tight">{member.name}</h1>
              <div className="flex flex-wrap gap-4 mt-2">
                <div className="flex items-center gap-1.5 text-ink-muted text-sm">
                  <Mail size={14} />
                  <span>{member.email}</span>
                </div>
                <div className="flex items-center gap-1.5 text-ink-muted text-sm">
                  <Brain size={14} />
                  <span>{member.role}</span>
                </div>
              </div>
            </div>
          </div>

          {mood && (
            <div className="flex items-center gap-4 bg-white/80 p-5 rounded-xl border border-border-subtle">
              <MoodFace mood={member.mood} size={48} />
              <div>
                <p className="text-[10px] font-medium text-ink-muted uppercase tracking-wider mb-0.5">Current</p>
                <p className="font-bold text-ink text-xl">{mood.label}</p>
                <p className="text-xs text-accent-teal font-medium mt-0.5">
                  {member.checkedInToday ? 'Checked in today' : 'Last recorded'}
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {checkins.length === 0 ? (
        <motion.div variants={itemVariants} className="card-flat p-16 text-center text-ink-muted">
          <Calendar size={32} className="mx-auto mb-3 text-ink-faint" />
          <h2 className="text-xl font-semibold text-ink mb-1">No data yet</h2>
          <p className="text-sm max-w-sm mx-auto">This member hasn't started their Mindly journey yet.</p>
        </motion.div>
      ) : (
        <>
          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <MetricCard label="Energy Level" value={member.energy} trend={energyTrend} icon={Zap} color="text-accent-teal" bgColor="bg-pastel-green" good="high" variants={itemVariants} />
            <MetricCard label="Stress Impact" value={member.stress} trend={stressTrend} icon={Flame} color="text-accent-coral" bgColor="bg-primary-light" good="low" variants={itemVariants} />
            <MetricCard label="Mental Load" value={member.mentalLoad} trend={loadTrend} icon={Brain} color="text-accent-indigo" bgColor="bg-secondary-light" good="low" variants={itemVariants} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Mood Log */}
            <motion.div variants={itemVariants} className="lg:col-span-1 card-flat p-6">
              <h2 className="text-base font-semibold text-ink mb-5">Mood Log</h2>
              <div className="space-y-2.5 max-h-[380px] overflow-y-auto no-scrollbar pr-1">
                {recent.map((c, i) => {
                  const m = moodConfig[c.mood] || moodConfig.okay
                  const date = new Date(c.date)
                  return (
                    <div key={c.id || i} className="flex items-center justify-between p-3 bg-surface-sunken rounded-xl">
                      <div className="flex items-center gap-3">
                        <MoodFace mood={c.mood} size={32} />
                        <div>
                          <p className="font-medium text-ink text-sm">{m.label}</p>
                          <p className="text-[10px] text-ink-muted">
                            {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>

            {/* Trends */}
            <motion.div variants={itemVariants} className="lg:col-span-2 card-flat p-8">
              <h2 className="text-base font-semibold text-ink mb-8">Vitality Trends</h2>
              <div className="flex items-end gap-1.5 h-40 mb-8">
                {recent.slice().reverse().map((c, i) => (
                  <div key={i} className="flex-1 flex gap-0.5 items-end h-full group relative">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(c.energy || 5) * 10}%` }}
                      transition={{ duration: 0.6, delay: i * 0.03 }}
                      className="flex-1 rounded-t-sm bg-accent-teal/20 group-hover:bg-accent-teal/50 transition-colors"
                    />
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(c.stress || 5) * 10}%` }}
                      transition={{ duration: 0.6, delay: i * 0.03 + 0.1 }}
                      className="flex-1 rounded-t-sm bg-accent-coral/20 group-hover:bg-accent-coral/50 transition-colors"
                    />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-ink text-white text-[10px] font-medium py-1 px-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {new Date(c.date).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-8 justify-center border-t border-border-subtle pt-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-accent-teal" />
                  <span className="text-xs font-medium text-ink-muted">Energy</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-accent-coral" />
                  <span className="text-xs font-medium text-ink-muted">Stress</span>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </motion.div>
  )
}

function MetricCard({ label, value, trend, icon: Icon, color, bgColor, good, variants }) {
  const isGoodTrend = trend !== null && (good === 'high' ? trend >= 0 : trend <= 0)
  const trendText = trend !== null ? (trend > 0 ? `+${trend.toFixed(1)}` : trend.toFixed(1)) : null

  return (
    <motion.div variants={variants} className="card-flat p-6">
      <div className="flex items-center justify-between mb-5">
        <div className={`w-10 h-10 rounded-lg ${bgColor} flex items-center justify-center ${color}`}>
          <Icon size={20} />
        </div>
        {trendText && trend !== 0 && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold ${
            isGoodTrend ? 'bg-pastel-green text-accent-teal' : 'bg-pastel-red text-mood-bad'
          }`}>
            {isGoodTrend ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {trendText}
          </div>
        )}
      </div>

      <div className="flex items-end gap-1.5">
        <span className="text-4xl font-bold text-ink">{value || '—'}</span>
        <span className="text-ink-faint text-lg font-medium mb-1">/10</span>
      </div>
      <p className="text-[11px] font-medium text-ink-muted uppercase tracking-wider mt-2">{label}</p>

      <div className="mt-4 h-1 bg-surface-sunken rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(value || 0) * 10}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${color.replace('text-', 'bg-')}`}
        />
      </div>
    </motion.div>
  )
}
