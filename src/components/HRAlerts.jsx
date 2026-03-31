import { motion } from 'framer-motion'
import { AlertTriangle, Zap, Flame, Brain, ChevronRight } from 'lucide-react'
import { EmptyStateIllustration } from './Illustrations'
import { Avatar } from './Avatar'

export default function HRAlerts({ members }) {
  const alerts = []

  members.forEach((m) => {
    if (!m.latestCheckin) return

    if ((m.stress || 0) >= 7) {
      alerts.push({
        id: `${m.id}-stress`,
        type: 'critical',
        member: m,
        title: 'High stress level',
        description: `${m.name} is experiencing significant pressure.`,
        icon: Flame,
        color: 'text-mood-bad',
        bgColor: 'bg-pastel-red',
      })
    }

    if ((m.energy || 0) <= 3) {
      alerts.push({
        id: `${m.id}-energy`,
        type: 'warning',
        member: m,
        title: 'Depleted energy',
        description: `${m.name} reports feeling very drained.`,
        icon: Zap,
        color: 'text-mood-low',
        bgColor: 'bg-pastel-orange',
      })
    }

    if ((m.mentalLoad || 0) >= 8) {
      alerts.push({
        id: `${m.id}-load`,
        type: 'warning',
        member: m,
        title: 'Mental overload',
        description: `${m.name} has a heavy mental weight today.`,
        icon: Brain,
        color: 'text-accent-indigo',
        bgColor: 'bg-secondary-light',
      })
    }

    if (m.mood === 'bad') {
      alerts.push({
        id: `${m.id}-mood`,
        type: 'critical',
        member: m,
        title: 'Emotional distress',
        description: `${m.name} shared a difficult reflection.`,
        icon: AlertTriangle,
        color: 'text-mood-bad',
        bgColor: 'bg-pastel-red',
      })
    }
  })

  const priority = { critical: 0, warning: 1, info: 2 }
  alerts.sort((a, b) => priority[a.type] - priority[b.type])

  const critical = alerts.filter(a => a.type === 'critical').length
  const warning = alerts.filter(a => a.type === 'warning').length

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen px-6 md:px-10 py-8 md:py-14 max-w-4xl mx-auto"
    >
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="font-display text-4xl md:text-5xl text-ink mb-2">Signal Center</h1>
        <p className="text-ink-muted text-base">
          {alerts.length === 0
            ? "Your team is thriving. No signals detected today."
            : `${alerts.length} signals need your attention.`
          }
        </p>
      </motion.div>

      {/* Summary pills */}
      {alerts.length > 0 && (
        <motion.div variants={itemVariants} className="flex gap-2 mb-8">
          {critical > 0 && (
            <span className="px-3 py-1.5 rounded-lg bg-pastel-red text-mood-bad text-xs font-semibold">
              {critical} critical
            </span>
          )}
          {warning > 0 && (
            <span className="px-3 py-1.5 rounded-lg bg-pastel-orange text-mood-low text-xs font-semibold">
              {warning} warning
            </span>
          )}
        </motion.div>
      )}

      {alerts.length === 0 ? (
        <motion.div variants={itemVariants} className="card-flat p-16 text-center">
          <EmptyStateIllustration className="w-40 h-auto mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-ink mb-2">All clear</h2>
          <p className="text-ink-muted text-sm max-w-sm mx-auto">
            Everything looks balanced. Your team's wellness signals are within optimal range.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              variants={itemVariants}
              className="card-flat p-5 flex items-center gap-5 group hover:bg-surface-sunken transition-colors cursor-pointer"
            >
              <div className={`w-11 h-11 rounded-xl ${alert.bgColor} flex items-center justify-center ${alert.color} shrink-0`}>
                <alert.icon size={22} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    alert.type === 'critical' ? 'bg-mood-bad text-white' : 'bg-mood-low text-white'
                  }`}>
                    {alert.type}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-ink">{alert.title}</h3>
                <p className="text-ink-muted text-sm">{alert.description}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2.5 pr-4 border-r border-border-subtle">
                  {alert.member.avatarConfig ? (
                    <Avatar config={alert.member.avatarConfig} size={32} className="rounded-lg" />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-surface-sunken flex items-center justify-center text-xs font-semibold text-ink border border-border-subtle">
                      {alert.member.avatar}
                    </div>
                  )}
                  <div className="text-right">
                    <p className="text-sm font-medium text-ink leading-tight">{alert.member.name}</p>
                    <p className="text-[10px] text-ink-muted">{alert.member.role}</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-ink-faint group-hover:text-ink-muted transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
