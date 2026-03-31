import { useState } from 'react'
import Sidebar from './Sidebar'
import CheckIn from './CheckIn'
import EmployeeHome from './EmployeeHome'
import EmployeeHistory from './EmployeeHistory'
import JoinTeam from './JoinTeam'
import AvatarEditor from './AvatarEditor'
import { useCheckins } from '../hooks/useCheckins'
import { useAuth } from '../hooks/useAuth'
import { Loader2 } from 'lucide-react'

export default function EmployeeApp({ user, profile, onLogout }) {
  const [view, setView] = useState('home')
  const [showCheckIn, setShowCheckIn] = useState(false)
  const { checkins, addCheckin, todayCheckin, loading, error } = useCheckins(user.uid)
  const { updateAvatar, refreshProfile } = useAuth()

  // If no team joined yet, show join screen
  if (!profile.teamId) {
    return <JoinTeam profile={profile} onLogout={onLogout} />
  }

  const handleCheckInComplete = async (responses) => {
    try {
      await addCheckin({
        ...responses,
        teamId: profile.teamId,
      })
    } catch (e) {
      console.error('Failed to save check-in:', e)
      alert('Failed to save your check-in. Please try again.')
    } finally {
      setTimeout(() => setShowCheckIn(false), 1500)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center text-primary mx-auto mb-3">
            <Loader2 className="animate-spin" size={24} />
          </div>
          <p className="text-ink-muted font-medium">Syncing your space...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface flex">
      <Sidebar
        currentView={view}
        onNavigate={setView}
        onStartCheckIn={() => setShowCheckIn(true)}
        profile={profile}
        onLogout={onLogout}
        isHR={false}
      />

      <main className="flex-1 md:ml-72 pb-20 md:pb-0">
        {view === 'home' && (
          <EmployeeHome
            profile={profile}
            todayCheckin={todayCheckin}
            checkins={checkins}
            onStartCheckIn={() => setShowCheckIn(true)}
          />
        )}
        {view === 'history' && (
          <EmployeeHistory checkins={checkins} />
        )}
        {view === 'settings' && (
          <AvatarEditor
            initialConfig={profile.avatarConfig}
            onSave={async (config) => {
              await updateAvatar(config)
              await refreshProfile(user.uid)
              setView('home')
            }}
            onBack={() => setView('home')}
          />
        )}
      </main>

      {showCheckIn && (
        <CheckIn
          onComplete={handleCheckInComplete}
          onClose={() => setShowCheckIn(false)}
        />
      )}
    </div>
  )
}
