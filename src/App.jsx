import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import Login from './components/Login'
import HRApp from './components/HRApp'
import EmployeeApp from './components/EmployeeApp'

function App() {
  const { user, userProfile, loading, logout } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-apple-light flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="w-20 h-20 bg-apple-blue rounded-[2rem] flex items-center justify-center shadow-apple-lg mx-auto mb-6">
            <span className="text-white text-3xl font-black">M</span>
          </div>
          <h1 className="text-2xl font-black text-apple-text tracking-tight">Mindly</h1>
          <p className="text-apple-muted mt-2 font-medium">Preparing your space...</p>
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
