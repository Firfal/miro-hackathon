import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { ArrowRight, Loader2, LogOut } from 'lucide-react'
import { JoinTeamIllustration } from './Illustrations'

export default function JoinTeam({ profile, onLogout }) {
  const { joinTeam } = useAuth()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (code.trim().length < 4) {
      setError('Please enter a valid team code')
      return
    }
    setError('')
    setLoading(true)
    try {
      await joinTeam(code)
      setSuccess(true)
      setTimeout(() => window.location.reload(), 1200)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <JoinTeamIllustration className="w-48 h-auto mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-ink tracking-tight mb-2">You're in!</h2>
          <p className="text-ink-muted text-base">Entering your team space...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md card-flat p-8 text-center"
      >
        <JoinTeamIllustration className="w-40 h-auto mx-auto mb-6" />

        <h1 className="text-2xl font-bold text-ink tracking-tight mb-2">Join your team</h1>
        <p className="text-ink-muted text-sm mb-8">
          Welcome, {profile.name.split(' ')[0]}. Enter the invite code from your HR manager.
        </p>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-pastel-red text-mood-bad px-4 py-3 rounded-xl mb-6 text-sm font-medium border border-mood-bad/10"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="input-field text-center text-2xl tracking-[0.3em] font-bold py-5 placeholder:text-lg placeholder:tracking-normal placeholder:font-normal"
            placeholder="CODE"
            maxLength={8}
            autoFocus
          />

          <motion.button
            type="submit"
            disabled={loading || code.trim().length < 4}
            whileTap={{ scale: 0.97 }}
            className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-base disabled:opacity-40"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                Join Team
                <ArrowRight size={18} />
              </>
            )}
          </motion.button>
        </form>

        <button
          onClick={onLogout}
          className="mt-8 flex items-center gap-2 text-ink-muted hover:text-mood-bad transition-colors text-xs font-medium mx-auto"
        >
          <LogOut size={13} />
          Sign out
        </button>
      </motion.div>
    </div>
  )
}
