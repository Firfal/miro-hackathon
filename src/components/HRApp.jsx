import { useState } from 'react'
import Sidebar from './Sidebar'
import HRDashboard from './HRDashboard'
import HRTeam from './HRTeam'
import HRCalendar from './HRCalendar'
import HRAlerts from './HRAlerts'
import HREmployeeDetail from './HREmployeeDetail'
import AvatarEditor from './AvatarEditor'
import { useTeamCheckins, useTeamMembers } from '../hooks/useCheckins'
import { useAuth } from '../hooks/useAuth'
import { Loader2 } from 'lucide-react'

export default function HRApp({ user, profile, onLogout }) {
  const [view, setView] = useState('dashboard')
  const [selectedMember, setSelectedMember] = useState(null)
  const { updateAvatar, refreshProfile } = useAuth()
  const teamId = profile.teamId
  const { checkins, loading: checkinsLoading } = useTeamCheckins(teamId)
  const { members, loading: membersLoading } = useTeamMembers(teamId)

  const loading = checkinsLoading || membersLoading

  // Enrich members with their latest checkin data
  const enrichedMembers = members.map((m) => {
    const memberCheckins = checkins
      .filter((c) => c.userId === m.id)
      .sort((a, b) => b.date.localeCompare(a.date))
    const latest = memberCheckins[0]
    return {
      ...m,
      checkins: memberCheckins,
      latestCheckin: latest,
      mood: latest?.mood || null,
      energy: latest?.energy || null,
      stress: latest?.stress || null,
      mentalLoad: latest?.mentalLoad || null,
      checkedInToday: latest?.date === new Date().toISOString().split('T')[0],
    }
  })

  const handleSelectMember = (member) => {
    setSelectedMember(member)
    setView('employee-detail')
  }

  const handleBack = () => {
    setSelectedMember(null)
    setView('team')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-apple-light flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="w-16 h-16 bg-apple-blue/10 rounded-2xl flex items-center justify-center text-apple-blue mx-auto mb-4">
            <Loader2 className="animate-spin" size={32} />
          </div>
          <p className="text-apple-muted font-bold tracking-tight">Syncing team data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-apple-light flex">
      <Sidebar
        currentView={view}
        onNavigate={setView}
        profile={profile}
        onLogout={onLogout}
        isHR={true}
      />

      <main className="flex-1 md:ml-72 pb-20 md:pb-0">
        {view === 'dashboard' && (
          <HRDashboard
            members={enrichedMembers}
            checkins={checkins}
            onSelectMember={handleSelectMember}
            teamCode={profile.teamCode}
          />
        )}
        {view === 'team' && (
          <HRTeam members={enrichedMembers} onSelectMember={handleSelectMember} />
        )}
        {view === 'calendar' && (
          <HRCalendar members={enrichedMembers} />
        )}
        {view === 'alerts' && (
          <HRAlerts members={enrichedMembers} />
        )}
        {view === 'employee-detail' && selectedMember && (
          <HREmployeeDetail member={selectedMember} onBack={handleBack} />
        )}
        {view === 'settings' && (
          <AvatarEditor
            initialConfig={profile.avatarConfig}
            onSave={async (config) => {
              await updateAvatar(config)
              await refreshProfile(user.uid)
              setView('dashboard')
            }}
            onBack={() => setView('dashboard')}
          />
        )}
      </main>
    </div>
  )
}
