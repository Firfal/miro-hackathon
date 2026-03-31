import { motion } from 'framer-motion'
import { ChevronLeft, Zap, Flame, Brain, TrendingUp, TrendingDown, Calendar, Mail, User } from 'lucide-react'
import { moodConfig } from '../data/mockData'
import { Avatar } from './Avatar'

export default function HREmployeeDetail({ member, onBack }) {
  const mood = member.mood ? moodConfig[member.mood] : null
  const checkins = member.checkins || []
  const recent = [...checkins].slice(0, 14)

  // Trends: last 7 vs previous 7
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
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
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
      {/* Back Button */}
      <motion.button
        variants={itemVariants}
        onClick={onBack}
        className="flex items-center gap-2 text-apple-muted hover:text-apple-text mb-12 text-sm font-bold uppercase tracking-widest transition-colors group"
      >
        <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back to Directory
      </motion.button>

      {/* Header / Profile Card */}
      <motion.div
        variants={itemVariants}
        className="apple-card overflow-hidden mb-12"
      >
        <div className="p-10 flex flex-col md:flex-row md:items-center justify-between gap-8" style={{ backgroundColor: mood ? mood.bgLight : '#FBFBFD' }}>
          <div className="flex items-center gap-8">
            {member.avatarConfig ? (
              <Avatar config={member.avatarConfig} size={96} className="rounded-[2rem] shadow-apple border border-black/5" />
            ) : (
              <div className="w-24 h-24 rounded-[2rem] bg-white flex items-center justify-center text-2xl font-bold text-apple-text shadow-apple border border-black/5">
                {member.avatar || <User size={40} />}
              </div>
            )}
            <div>
              <h1 className="text-4xl font-extrabold text-apple-text tracking-tight leading-tight">{member.name}</h1>
              <div className="flex flex-wrap gap-4 mt-3">
                <div className="flex items-center gap-2 text-apple-muted font-medium">
                  <Mail size={16} />
                  <span className="text-sm">{member.email}</span>
                </div>
                <div className="flex items-center gap-2 text-apple-muted font-medium">
                  <Brain size={16} />
                  <span className="text-sm">{member.role}</span>
                </div>
              </div>
            </div>
          </div>
          
          {mood && (
            <div className="flex items-center gap-6 glass shadow-apple p-6 rounded-[2rem]">
              <span className="text-6xl drop-shadow-md">{mood.emoji}</span>
              <div>
                <p className="text-[10px] font-bold text-apple-muted uppercase tracking-[0.2em] mb-1">Current State</p>
                <p className="font-black text-apple-text text-2xl tracking-tight">{mood.label}</p>
                <p className="text-xs font-bold text-mood-great mt-1 uppercase tracking-widest">
                  {member.checkedInToday ? 'Checked in today' : 'Last activity recorded'}
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {checkins.length === 0 ? (
        <motion.div variants={itemVariants} className="apple-card p-20 text-center text-apple-muted">
          <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-6 text-apple-muted/20">
            <Calendar size={40} />
          </div>
          <h2 className="text-2xl font-bold text-apple-text mb-2 tracking-tight">No data available</h2>
          <p className="font-medium text-lg max-w-md mx-auto leading-relaxed text-balance">
            This team member hasn't started their Mindly journey yet.
          </p>
        </motion.div>
      ) : (
        <>
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <MetricCard 
              label="Energy Level" 
              value={member.energy} 
              trend={energyTrend} 
              icon={Zap} 
              color="text-mood-great" 
              bgColor="bg-mood-great/10"
              good="high" 
              variants={itemVariants}
            />
            <MetricCard 
              label="Stress Impact" 
              value={member.stress} 
              trend={stressTrend} 
              icon={Flame} 
              color="text-mood-low" 
              bgColor="bg-mood-low/10"
              good="low" 
              variants={itemVariants}
            />
            <MetricCard 
              label="Mental Capacity" 
              value={member.mentalLoad} 
              trend={loadTrend} 
              icon={Brain} 
              color="text-apple-blue" 
              bgColor="bg-apple-blue/10"
              good="low" 
              variants={itemVariants}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent History Strip */}
            <motion.div variants={itemVariants} className="lg:col-span-1 apple-card p-8">
              <h2 className="text-xl font-bold text-apple-text mb-8 tracking-tight">Mood Log</h2>
              <div className="space-y-4 max-h-[400px] overflow-y-auto no-scrollbar pr-2">
                {recent.map((c, i) => {
                  const m = moodConfig[c.mood] || moodConfig.okay
                  const date = new Date(c.date)
                  return (
                    <div key={c.id || i} className="flex items-center justify-between p-4 bg-black/5 rounded-2xl group hover:bg-black/10 transition-colors">
                      <div className="flex items-center gap-4">
                        <span className="text-3xl drop-shadow-sm">{m.emoji}</span>
                        <div>
                          <p className="font-bold text-apple-text text-sm leading-tight">{m.label}</p>
                          <p className="text-[10px] font-bold text-apple-muted uppercase tracking-widest mt-0.5">
                            {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-mood-great/40" />
                         <div className="w-1.5 h-1.5 rounded-full bg-mood-low/40" />
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>

            {/* Trends Chart */}
            <motion.div variants={itemVariants} className="lg:col-span-2 apple-card p-10">
              <h2 className="text-xl font-bold text-apple-text mb-10 tracking-tight">Vitality Trends</h2>
              <div className="flex items-end gap-2 h-48 mb-10">
                {recent.slice().reverse().map((c, i) => (
                  <div key={i} className="flex-1 flex gap-1 items-end h-full group relative">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(c.energy || 5) * 10}%` }}
                      transition={{ duration: 1, delay: i * 0.05 }}
                      className="flex-1 rounded-t-full bg-mood-great/30 group-hover:bg-mood-great transition-colors cursor-help"
                    />
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(c.stress || 5) * 10}%` }}
                      transition={{ duration: 1, delay: i * 0.05 + 0.2 }}
                      className="flex-1 rounded-t-full bg-mood-low/30 group-hover:bg-mood-low transition-colors cursor-help"
                    />
                    
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-apple-text text-white text-[10px] font-bold py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-apple-lg">
                       {new Date(c.date).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-10 justify-center border-t border-black/5 pt-8">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-mood-great shadow-inner" />
                  <span className="text-xs font-bold text-apple-muted uppercase tracking-[0.15em]">Vitality Index</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-mood-low shadow-inner" />
                  <span className="text-xs font-bold text-apple-muted uppercase tracking-[0.15em]">Stress Load</span>
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
    <motion.div variants={variants} whileHover={{ y: -5 }} className="apple-card p-8">
      <div className="flex items-center justify-between mb-8">
        <div className={`w-12 h-12 rounded-2xl ${bgColor} flex items-center justify-center ${color} shadow-inner`}>
          <Icon size={24} strokeWidth={2.5} />
        </div>
        {trendText && trend !== 0 && (
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${isGoodTrend ? 'bg-mood-great/10 text-mood-great' : 'bg-mood-bad/10 text-mood-bad'}`}>
            {isGoodTrend ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trendText}
          </div>
        )}
      </div>
      
      <div className="flex items-end gap-2">
        <span className="text-5xl font-black text-apple-text tracking-tighter">{value || '—'}</span>
        <span className="text-apple-muted/30 text-2xl font-bold mb-1.5">/10</span>
      </div>
      <p className="text-[11px] font-bold text-apple-muted uppercase tracking-[0.2em] mt-3">{label}</p>
      
      <div className="mt-6 h-1.5 bg-black/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(value || 0) * 10}%` }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className={`h-full rounded-full ${color.replace('text-', 'bg-')}`} 
        />
      </div>
    </motion.div>
  )
}
