import { motion } from 'framer-motion'
import { Activity, Zap, Flame, Brain, AlertTriangle, Share2, Copy, Check, Edit2, Save, X, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { moodConfig } from '../data/mockData'
import { useAuth } from '../hooks/useAuth'
import { Avatar } from './Avatar'

export default function HRDashboard({ members, checkins, onSelectMember, teamCode }) {
  const { userProfile, updateTeamName } = useAuth()
  const [copied, setCopied] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)
  const [newTeamName, setNewTeamName] = useState(userProfile?.teamName || 'Team Vitality')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (userProfile?.teamName) {
      setNewTeamName(userProfile.teamName)
    }
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
      className="min-h-screen px-6 md:px-12 py-8 md:py-16 max-w-7xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-12">
        <p className="text-sm font-bold text-apple-blue uppercase tracking-widest">{dateStr}</p>
        
        <div className="flex items-center gap-4 mt-2 group">
          {isEditingName ? (
            <div className="flex items-center gap-3 w-full max-w-2xl">
              <input
                type="text"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                className="text-4xl md:text-6xl font-extrabold text-apple-text tracking-tight bg-transparent border-b-2 border-apple-blue outline-none w-full"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
              />
              <button 
                onClick={handleSaveName}
                disabled={isSaving}
                className="p-3 bg-apple-blue text-white rounded-2xl hover:bg-blue-600 transition-colors shadow-apple disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
              </button>
              <button 
                onClick={() => { setIsEditingName(false); setNewTeamName(userProfile?.teamName || 'Team Vitality'); }}
                className="p-3 bg-black/5 text-apple-muted rounded-2xl hover:bg-black/10 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          ) : (
            <>
              <h1 className="text-4xl md:text-6xl font-extrabold text-apple-text tracking-tight">{userProfile?.teamName || 'Team Vitality'}</h1>
              <button 
                onClick={() => setIsEditingName(true)}
                className="opacity-0 group-hover:opacity-100 p-2 text-apple-muted hover:text-apple-blue transition-all"
              >
                <Edit2 size={24} />
              </button>
            </>
          )}
        </div>

        <p className="text-apple-muted mt-4 text-lg font-medium">
          {total > 0
            ? <span className="text-apple-text font-bold">{checkedIn}</span>
            : 'No'
          } members shared their vibe today out of {total}.
        </p>
      </motion.div>

      {/* Team invite code - Apple Style Banner */}
      {teamCode && (
        <motion.div 
          variants={itemVariants}
          className="mb-12 glass shadow-apple p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-[2rem] bg-apple-blue/10 flex items-center justify-center text-apple-blue shadow-inner">
              <Share2 size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-apple-text">Grow your community</h2>
              <p className="text-apple-muted font-medium">New members use this code to join Mindly</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-black/5 p-2 rounded-[2rem] pl-8">
            <span className="text-3xl font-bold tracking-[0.3em] font-mono text-apple-text uppercase">{teamCode}</span>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 px-6 py-4 rounded-[1.5rem] font-bold transition-all duration-300 ${
                copied ? 'bg-mood-great text-white' : 'bg-apple-text text-white hover:bg-black'
              }`}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? 'Copied' : 'Copy Code'}
            </button>
          </div>
        </motion.div>
      )}

      {total > 0 && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
            <BigStat
              label="Vitality Index"
              value={wellnessScore}
              icon={Activity}
              color="text-mood-great"
              bgColor="bg-mood-great/10"
              variants={itemVariants}
            />
            <BigStat
              label="Avg. Energy"
              value={avgEnergy}
              icon={Zap}
              color="text-mood-good"
              bgColor="bg-mood-good/10"
              variants={itemVariants}
            />
            <BigStat
              label="Avg. Stress"
              value={avgStress}
              icon={Flame}
              color="text-mood-low"
              bgColor="bg-mood-low/10"
              variants={itemVariants}
            />
            <BigStat
              label="Mental Load"
              value={avgLoad}
              icon={Brain}
              color="text-apple-blue"
              bgColor="bg-apple-blue/10"
              variants={itemVariants}
            />
            <BigStat
              label="Active Alerts"
              value={alertMembers.length}
              icon={AlertTriangle}
              color={alertMembers.length > 0 ? 'text-mood-bad' : 'text-mood-great'}
              bgColor={alertMembers.length > 0 ? 'bg-mood-bad/10' : 'bg-mood-great/10'}
              variants={itemVariants}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Mood Distribution Card */}
            <motion.div variants={itemVariants} className="lg:col-span-1 apple-card p-8">
              <h2 className="text-xl font-bold text-apple-text mb-8">Mood Pulse</h2>
              <div className="space-y-6">
                {Object.entries(moodConfig).map(([key, cfg]) => {
                  const count = moodCounts[key] || 0
                  const pct = todayCheckins.length > 0 ? (count / todayCheckins.length) * 100 : 0
                  return (
                    <div key={key}>
                      <div className="flex justify-between items-end mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{cfg.emoji}</span>
                          <span className="text-sm font-bold text-apple-text">{cfg.label}</span>
                        </div>
                        <span className="text-sm font-bold text-apple-muted">{count}</span>
                      </div>
                      <div className="w-full bg-black/5 h-2 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: cfg.color }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>

            {/* Team List Card */}
            <motion.div variants={itemVariants} className="lg:col-span-2 apple-card overflow-hidden">
              <div className="px-8 py-6 border-b border-black/5 flex items-center justify-between">
                <h2 className="text-xl font-bold text-apple-text">Team Activity</h2>
                <div className="flex gap-2">
                   <div className="px-3 py-1 bg-black/5 rounded-full text-[10px] font-bold text-apple-muted uppercase tracking-wider">
                     {total} Members
                   </div>
                </div>
              </div>
              <div className="max-h-[500px] overflow-y-auto no-scrollbar">
                {members.map((m, idx) => {
                  const mood = m.mood ? moodConfig[m.mood] : null
                  return (
                    <motion.button
                      whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                      key={m.id}
                      onClick={() => onSelectMember(m)}
                      className="w-full px-8 py-4 flex items-center justify-between text-left group transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          {m.avatarConfig ? (
                            <Avatar config={m.avatarConfig} size={48} className="rounded-2xl shadow-sm border border-black/5" />
                          ) : (
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-apple-light to-apple-gray flex items-center justify-center text-sm font-bold text-apple-text border border-black/5 shadow-sm">
                              {m.avatar}
                            </div>
                          )}
                          {m.checkedInToday && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-mood-great border-2 border-white rounded-full shadow-sm" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-[15px] text-apple-text leading-tight">{m.name}</p>
                          <p className="text-xs text-apple-muted font-medium">{m.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        {mood && (
                          <div
                            className="px-4 py-1.5 rounded-full text-xs font-bold shadow-sm"
                            style={{ backgroundColor: mood.bgLight, color: mood.color }}
                          >
                            {mood.emoji} {mood.label}
                          </div>
                        )}
                        <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs font-bold text-apple-blue uppercase tracking-wider">View Detail</span>
                          <span className="text-apple-muted/30 group-hover:text-apple-blue text-xl">›</span>
                        </div>
                      </div>
                    </motion.button>
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
      whileHover={{ y: -5, scale: 1.02 }}
      className={`apple-card p-6 flex flex-col items-center justify-center text-center cursor-default`}
    >
      <div className={`w-12 h-12 rounded-2xl ${bgColor} flex items-center justify-center ${color} mb-4 shadow-inner`}>
        <Icon size={24} strokeWidth={2.5} />
      </div>
      <p className="text-3xl font-extrabold text-apple-text tracking-tight">{value}</p>
      <p className="text-[11px] font-bold text-apple-muted uppercase tracking-widest mt-2">{label}</p>
    </motion.div>
  )
}
