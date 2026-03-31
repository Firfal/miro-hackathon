import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { Mail, Lock, User as UserIcon, ShieldCheck, ArrowRight, Loader2, Users } from 'lucide-react'
import { WelcomeIllustration } from './Illustrations'

export default function Login() {
  const { login, register } = useAuth()
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('employee')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isRegister) {
        await register(email, password, name, role)
      } else {
        await login(email, password)
      }
    } catch (err) {
      setError(
        err.code === 'auth/user-not-found' ? 'No account found with this email' :
        err.code === 'auth/wrong-password' ? 'Incorrect password' :
        err.code === 'auth/invalid-credential' ? 'Invalid email or password' :
        err.code === 'auth/email-already-in-use' ? 'Email already registered' :
        err.code === 'auth/weak-password' ? 'Password must be at least 6 characters' :
        err.message
      )
    } finally {
      setLoading(false)
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
    <div className="min-h-screen bg-surface flex overflow-hidden font-sans">
      {/* Left — Branding & Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center bg-surface-warm">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="relative z-10 text-center px-16 max-w-lg"
        >
          <motion.div variants={itemVariants} className="flex items-center justify-center gap-3 mb-12">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-white text-xl font-bold">M</span>
            </div>
            <span className="text-2xl font-bold text-ink tracking-tight">Mindly</span>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-12">
            <WelcomeIllustration className="w-72 h-auto mx-auto" />
          </motion.div>

          <motion.h2 variants={itemVariants} className="font-display text-4xl text-ink mb-4 leading-snug">
            <em>Take care</em> of the minds<br />that build your product.
          </motion.h2>
          <motion.p variants={itemVariants} className="text-ink-muted text-lg leading-relaxed">
            A quiet space for your team's wellbeing.
          </motion.p>
        </motion.div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center px-6 lg:px-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <motion.div variants={itemVariants} className="lg:hidden text-center mb-10">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white text-xl font-bold">M</span>
            </div>
            <h1 className="text-2xl font-bold text-ink tracking-tight">Mindly</h1>
          </motion.div>

          <motion.h2 variants={itemVariants} className="text-3xl font-bold text-ink tracking-tight mb-1.5">
            {isRegister ? 'Create your account' : 'Welcome back'}
          </motion.h2>
          <motion.p variants={itemVariants} className="text-ink-muted text-base mb-8">
            {isRegister ? 'Start prioritizing your team\'s mental health.' : 'Sign in to your space.'}
          </motion.p>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="bg-pastel-red text-mood-bad px-4 py-3 rounded-xl mb-6 text-sm font-medium flex items-center gap-2.5 border border-mood-bad/10"
              >
                <ShieldCheck size={16} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {isRegister && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" size={18} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input-field pl-11"
                      placeholder="Full Name"
                      required
                    />
                  </div>

                  <div className="space-y-2.5">
                    <p className="text-sm font-medium text-ink px-0.5">Your role</p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: 'employee', label: 'Team Member', icon: UserIcon },
                        { value: 'hr', label: 'Admin / HR', icon: Users },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setRole(opt.value)}
                          className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2.5 ${
                            role === opt.value
                              ? 'border-primary bg-primary-light'
                              : 'border-border bg-white hover:border-ink-faint'
                          }`}
                        >
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                            role === opt.value ? 'bg-primary/10 text-primary' : 'bg-surface-sunken text-ink-muted'
                          }`}>
                            <opt.icon size={18} />
                          </div>
                          <p className="font-semibold text-ink text-sm">{opt.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-11"
                placeholder="Work email"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-11"
                placeholder="Password"
                required
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.97 }}
              className="w-full btn-primary py-4 flex items-center justify-center gap-2.5 text-base mt-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  {isRegister ? 'Create account' : 'Sign in'}
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>

          <motion.p variants={itemVariants} className="text-center mt-8 text-ink-muted text-sm">
            {isRegister ? 'Already have an account?' : 'New to Mindly?'}{' '}
            <button
              onClick={() => { setIsRegister(!isRegister); setError('') }}
              className="text-primary font-semibold hover:underline"
            >
              {isRegister ? 'Sign in' : 'Create an account'}
            </button>
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}
