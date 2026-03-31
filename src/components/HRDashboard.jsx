import { motion } from 'framer-motion'
import { Activity, Zap, Flame, Brain, AlertTriangle, Share2, Copy, Check, Edit2, Save, X, Loader2, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { moodConfig } from '../data/mockData'
import { useAuth } from '../hooks/useAuth'
import { Avatar } from './Avatar'
import { MoodFace } from './Illustrations'
import HRAIInsights from './HRAIInsights'

export default function HRDashboard({ members, checkins, onSelectMember, teamCode }) {
  const { userProfile, updateTeamName } = useAuth()
  const [copied, setCopied] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)
  const [newTeamName, setNewTeamName] = useState(userProfile?.teamName || 'Team Vitality')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (userProfile?.teamName) setNewTeamName(userProfile.teamName)
  }, [userProfile?.teamName])

  const today = new Date()
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  const todayStr = today.toISOString().split('T')[0]

  const checkedIn = members.filter((m) => m.checkedInToday).length
  const total = members.length

  const todayCheckins = checkins.filter((c) => c.date === todayStr)
  const avgEnergy = todayCheckins.length > 0
    ? (todayCheckins.reduce((s, c) => s + (c.energy || 0), 0) / todayCheckins.length).toFixed(1)
    : '—'
  const avgStress = todayCheckins.length > 0
    ? (todayCheckins.reduce((s, c) => s + (c.stress || 0), 0) / todayCheckins.length).toFixed(1)
    : '—'
  const avgLoad = todayCheckins.length > 0
    ? (todayCheckins.reduce((s, c) => s + (c.mentalLoad || 0), 0) / todayCheckins.length).toFixed(1)
    : '—'

  const moodCounts = {}
  todayCheckins.forEach((c) => {
    if (c.mood) moodCounts[c.mood] = (moodCounts[c.mood] || 0) + 1
  })

  const wellnessScore = todayCheckins.length > 0
    ? (((parseFloat(avgEnergy) || 0) + (10 - (parseFloat(avgStress) || 0))) / 2).toFixed(1)
    : '—'

  const alertMembers = members.filter((m) => (m.stress || 0) >= 7 || (m.energy || 0) <= 3)

  const handleCopy = () => {
    navigator.clipboard.writeText(teamCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSaveName = async () => {
    if (!newTeamName.trim() || newTeamName === userProfile?.teamName) {
      setIsEditingName(false)
      return
    }
    setIsSaving(true)
    try {
      await updateTeamName(newTeamName)
      setIsEditingName(false)
    } catch (error) {
      console.error("Failed to update team name:", error)
    } finally {
      setIsSaving(false)
    }
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
      className="min-h-screen px-6 md:px-10 py-8 md:py-14 max-w-6xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-10">
        <p className="text-sm font-medium text-primary tracking-wide mb-1">{dateStr}</p>

        <div className="flex items-center gap-3 group">
          {isEditingName ? (
            <div className="flex items-center gap-2 w-full max-w-lg">
              <input
                type="text"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                className="font-display text-4xl md:text-5xl text-ink bg-transparent border-b-2 border-primary outline-none w-full"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
              />
              <button
                onClick={handleSaveName}
                disabled={isSaving}
                className="p-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              </button>
              <button
                onClick={() => { setIsEditingName(false); setNewTeamName(userProfile?.teamName || 'Team Vitality') }}
                className="p-2.5 bg-surface-sunken text-ink-muted rounded-xl hover:bg-border transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <>
              <h1 className="font-display text-4xl md:text-5xl text-ink">{userProfile?.teamName || 'Team Vitality'}</h1>
              <button
                onClick={() => setIsEditingName(true)}
                className="opacity-0 group-hover:opacity-100 p-2 text-ink-muted hover:text-primary transition-all"
              >
                <Edit2 size={18} />
              </button>
            </>
          )}
        </div>

        <p className="text-ink-muted mt-2">
          <span className="font-semibold text-ink">{checkedIn}</span> of {total} members checked in today.
        </p>
      </motion.div>

      {/* Invite banner */}
      {teamCode && (
        <motion.div
          variants={itemVariants}
          className="mb-10 card-flat p-6 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-secondary-light flex items-center justify-center text-secondary">
              <Share2 size={22} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-ink">Invite your team</h2>
              <p className="text-ink-muted text-sm">Share this code with new members</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-surface-sunken p-2 rounded-xl pl-6">
            <span className="text-xl font-bold tracking-[0.25em] font-mono text-ink">{teamCode}</span>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                copied ? 'bg-accent-teal text-white' : 'bg-ink text-white hover:bg-ink-light'
              }`}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </motion.div>
      )}

      {total > 0 && (
        <>
          {/* AI Insight Section */}
          <motion.div variants={itemVariants} className="mb-10">
            <HRAIInsights checkins={checkins} members={members} />
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
            <BigStat label="Vitality" value={wellnessScore} icon={Activity} color="text-accent-teal" bgColor="bg-pastel-green" variants={itemVariants} />
            <BigStat label="Energy" value={avgEnergy} icon={Zap} color="text-accent-indigo" bgColor="bg-secondary-light" variants={itemVariants} />
            <BigStat label="Stress" value={avgStress} icon={Flame} color="text-accent-coral" bgColor="bg-primary-light" variants={itemVariants} />
            <BigStat label="Load" value={avgLoad} icon={Brain} color="text-accent-plum" bgColor="bg-pastel-lavender" variants={itemVariants} />
            <BigStat label="Alerts" value={alertMembers.length} icon={AlertTriangle} color={alertMembers.length > 0 ? 'text-mood-bad' : 'text-accent-teal'} bgColor={alertMembers.length > 0 ? 'bg-pastel-red' : 'bg-pastel-green'} variants={itemVariants} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Mood Pulse */}
            <motion.div variants={itemVariants} className="lg:col-span-1 card-flat p-6">
              <h2 className="text-base font-semibold text-ink mb-6">Mood Pulse</h2>
              <div className="space-y-4">
                {Object.entries(moodConfig).map(([key, cfg]) => {
                  const count = moodCounts[key] || 0
                  const pct = todayCheckins.length > 0 ? (count / todayCheckins.length) * 100 : 0
                  return (
                    <div key={key}>
                      <div className="flex justify-between items-center mb-1.5">
                        <div className="flex items-center gap-2">
                          <MoodFace mood={key} size={24} />
                          <span className="text-sm font-medium text-ink">{cfg.label}</span>
                        </div>
                        <span className="text-sm font-semibold text-ink-muted">{count}</span>
                      </div>
                      <div className="w-full bg-surface-sunken h-1.5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: cfg.color }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>

            {/* Team List */}
            <motion.div variants={itemVariants} className="lg:col-span-2 card-flat overflow-hidden">
              <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between">
                <h2 className="text-base font-semibold text-ink">Team Activity</h2>
                <span className="text-xs font-medium text-ink-muted bg-surface-sunken px-2.5 py-1 rounded-md">
                  {total} members
                </span>
              </div>
              <div className="max-h-[480px] overflow-y-auto no-scrollbar">
                {members.map((m) => {
                  const mood = m.mood ? moodConfig[m.mood] : null
                  return (
                    <button
                      key={m.id}
                      onClick={() => onSelectMember(m)}
                      className="w-full px-6 py-3.5 flex items-center justify-between text-left hover:bg-surface-sunken transition-colors group"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="relative">
                          {m.avatarConfig ? (
                            <Avatar config={m.avatarConfig} size={40} className="rounded-xl" />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-surface-sunken flex items-center justify-center text-sm font-semibold text-ink border border-border-subtle">
                              {m.avatar}
                            </div>
                          )}
                          {m.checkedInToday && (
                            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-accent-teal border-2 border-white rounded-full" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm text-ink">{m.name}</p>
                          <p className="text-xs text-ink-muted">{m.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {mood && (
                          <div
                            className="px-3 py-1 rounded-lg text-xs font-semibold"
                            style={{ backgroundColor: mood.bgLight, color: mood.color }}
                          >
                            {mood.label}
                          </div>
                        )}
                        <ChevronRight size={16} className="text-ink-faint group-hover:text-ink-muted transition-colors" />
                      </div>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </motion.div>
  )
}

function BigStat({ label, value, icon: Icon, color, bgColor, variants }) {
  return (
    <motion.div
      variants={variants}
      className="card-flat p-5 flex flex-col items-center text-center"
    >
      <div className={`w-10 h-10 rounded-lg ${bgColor} flex items-center justify-center ${color} mb-3`}>
        <Icon size={20} />
      </div>
      <p className="text-2xl font-bold text-ink">{value}</p>
      <p className="text-[11px] font-medium text-ink-muted uppercase tracking-wider mt-1">{label}</p>
    </motion.div>
  )
}
