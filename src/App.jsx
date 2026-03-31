import { useAuth } from './hooks/useAuth'
import Login from './components/Login'
import HRApp from './components/HRApp'
import EmployeeApp from './components/EmployeeApp'
import { Loader2 } from 'lucide-react'

function App() {
  const { user, userProfile, loading, logout } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold text-ink tracking-tight mb-1">Mindly</h1>
          <div className="flex items-center justify-center gap-2 text-ink-muted text-sm">
            <Loader2 className="animate-spin" size={14} />
            <span>Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!user || !userProfile) {
    return <Login />
  }

  if (userProfile.role === 'hr') {
    return <HRApp user={user} profile={userProfile} onLogout={logout} />
  }

  return <EmployeeApp user={user} profile={userProfile} onLogout={logout} />
}

export default App
