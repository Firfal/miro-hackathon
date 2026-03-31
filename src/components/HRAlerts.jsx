import { motion } from 'framer-motion'
import { AlertTriangle, Zap, Flame, Brain, Info, CheckCircle2, ChevronRight, User } from 'lucide-react'
import { moodConfig } from '../data/mockData'

export default function HRAlerts({ members }) {
  // Generate alerts based on member data
  const alerts = []

  members.forEach((m) => {
    if (!m.latestCheckin) return

    // High stress alert
    if ((m.stress || 0) >= 7) {
      alerts.push({
        id: `${m.id}-stress`,
        type: 'critical',
        member: m,
        title: 'High stress level',
        description: `${m.name} is experiencing significant pressure.`,
        icon: Flame,
        color: 'text-mood-bad',
        bgColor: 'bg-mood-bad/10',
      })
    }

    // Low energy alert
    if ((m.energy || 0) <= 3) {
      alerts.push({
        id: `${m.id}-energy`,
        type: 'warning',
        member: m,
        title: 'Depleted energy',
        description: `${m.name} reports feeling very drained.`,
        icon: Zap,
        color: 'text-mood-low',
        bgColor: 'bg-mood-low/10',
      })
    }

    // High mental load
    if ((m.mentalLoad || 0) >= 8) {
      alerts.push({
        id: `${m.id}-load`,
        type: 'warning',
        member: m,
        title: 'Mental overload',
        description: `${m.name} has a heavy mental weight today.`,
        icon: Brain,
        color: 'text-apple-blue',
        bgColor: 'bg-apple-blue/10',
      })
    }

    // Bad mood
    if (m.mood === 'bad') {
      alerts.push({
        id: `${m.id}-mood`,
        type: 'critical',
        member: m,
        title: 'Emotional distress',
        description: `${m.name} shared a difficult reflection.`,
        icon: AlertTriangle,
        color: 'text-mood-bad',
        bgColor: 'bg-mood-bad/10',
      })
    }
  })

  const priority = { critical: 0, warning: 1, info: 2 }
  alerts.sort((a, b) => priority[a.type] - priority[b.type])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    }
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen px-6 md:px-12 py-8 md:py-16 max-w-5xl mx-auto"
    >
      <motion.div variants={itemVariants} className="mb-12">
        <h1 className="text-4xl md:text-6xl font-extrabold text-apple-text tracking-tight mb-4">Signal Center</h1>
        <p className="text-apple-muted text-xl font-medium">
          {alerts.length === 0
            ? "Your team is thriving. No signals detected today."
            : `We've detected ${alerts.length} signals that might need your attention.`
          }
        </p>
      </motion.div>

      {alerts.length === 0 ? (
        <motion.div 
          variants={itemVariants}
          className="apple-card p-20 text-center"
        >
          <div className="w-24 h-24 bg-mood-great/10 rounded-[2.5rem] flex items-center justify-center text-mood-great mx-auto mb-8 shadow-inner">
            <CheckCircle2 size={48} strokeWidth={2.5} />
          </div>
          <h2 className="text-3xl font-extrabold text-apple-text mb-3 tracking-tight">System Healthy</h2>
          <p className="text-apple-muted text-lg font-medium max-w-md mx-auto">
            Everything looks balanced. Your team's wellness signals are within optimal range.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              variants={itemVariants}
              whileHover={{ scale: 1.01, x: 10 }}
              className="apple-card p-6 flex items-center gap-6 group cursor-pointer"
            >
              <div className={`w-16 h-16 rounded-[1.5rem] ${alert.bgColor} flex items-center justify-center ${alert.color} shadow-inner flex-shrink-0`}>
                <alert.icon size={32} strokeWidth={2.5} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full ${
                    alert.type === 'critical' ? 'bg-mood-bad text-white' :
                    alert.type === 'warning' ? 'bg-mood-low text-white' :
                    'bg-apple-blue text-white'
                  }`}>
                    {alert.type}
                  </span>
                  <span className="text-xs font-bold text-apple-muted uppercase tracking-widest">Active Signal</span>
                </div>
                <h3 className="text-xl font-extrabold text-apple-text tracking-tight">{alert.title}</h3>
                <p className="text-apple-muted font-medium mt-1">{alert.description}</p>
              </div>

              <div className="flex items-center gap-6">
                <div className="hidden md:flex items-center gap-3 pr-6 border-r border-black/5">
                   <div className="w-10 h-10 rounded-xl bg-apple-light flex items-center justify-center text-sm font-bold text-apple-text border border-black/5">
                      {alert.member.avatar}
                   </div>
                   <div className="text-right">
                      <p className="text-sm font-bold text-apple-text leading-tight">{alert.member.name}</p>
                      <p className="text-[10px] font-bold text-apple-muted uppercase mt-0.5">{alert.member.role}</p>
                   </div>
                </div>
                <ChevronRight size={24} className="text-apple-muted/30 group-hover:text-apple-text transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
