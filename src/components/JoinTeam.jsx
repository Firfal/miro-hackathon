import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { Users, ArrowRight, Loader2, LogOut } from 'lucide-react'

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

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-apple-light flex items-center justify-center p-6">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-mood-great rounded-[2rem] flex items-center justify-center text-white text-5xl shadow-apple-lg mx-auto mb-8">
            <Users size={48} strokeWidth={3} />
          </div>
          <h2 className="text-4xl font-extrabold text-apple-text tracking-tight mb-2">You're in!</h2>
          <p className="text-apple-muted text-lg font-medium">Entering your team space...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-apple-light flex items-center justify-center px-6">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md apple-card p-10 text-center"
      >
        <div className="w-20 h-20 bg-apple-blue/10 rounded-[1.8rem] flex items-center justify-center text-apple-blue mx-auto mb-8 shadow-inner">
          <Users size={40} />
        </div>
        
        <h1 className="text-3xl font-extrabold text-apple-text tracking-tight mb-3">Join your team</h1>
        <p className="text-apple-muted font-medium mb-10">
          Welcome, {profile.name.split(' ')[0]}. Enter the invite code provided by your HR manager.
        </p>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-mood-bad/10 text-mood-bad px-5 py-3 rounded-2xl mb-8 text-sm font-bold border border-mood-bad/10"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full bg-black/5 border-none rounded-3xl px-6 py-6 text-apple-text text-center text-4xl tracking-[0.4em] font-black placeholder:text-apple-muted/20 placeholder:text-lg placeholder:tracking-normal focus:ring-4 focus:ring-apple-blue/10 transition-all"
              placeholder="CODE"
              maxLength={8}
              autoFocus
            />
          </div>
          
          <motion.button
            type="submit"
            disabled={loading || code.trim().length < 4}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-apple-text text-white font-bold py-5 rounded-2xl hover:bg-black transition-all shadow-apple-lg flex items-center justify-center gap-3 text-lg disabled:opacity-40"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : (
              <>
                Join Team
                <ArrowRight size={20} strokeWidth={3} />
              </>
            )}
          </motion.button>
        </form>

        <button
          onClick={onLogout}
          className="mt-10 flex items-center gap-2 text-apple-muted hover:text-mood-bad transition-colors font-bold text-xs uppercase tracking-widest mx-auto"
        >
          <LogOut size={14} strokeWidth={3} />
          Sign out
        </button>
      </motion.div>
    </div>
  )
}
