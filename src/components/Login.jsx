import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { Mail, Lock, User as UserIcon, ShieldCheck, ArrowRight, Loader2, Users } from 'lucide-react'

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
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
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
    <div className="min-h-screen bg-apple-light flex overflow-hidden font-sans">
      {/* Left — Aesthetic Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden">
        {/* Modern Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-apple-light to-pastel-blue/30" />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -left-20 w-[40rem] h-[40rem] bg-apple-blue/5 rounded-full blur-3xl" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, -10, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 -right-20 w-[50rem] h-[50rem] bg-pastel-lavender/10 rounded-full blur-3xl" 
        />

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="relative z-10 text-center px-16"
        >
          <motion.div variants={itemVariants} className="w-24 h-24 bg-apple-blue rounded-[2rem] flex items-center justify-center shadow-apple-lg mx-auto mb-10">
            <span className="text-white text-5xl font-black">M</span>
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-6xl font-black text-apple-text tracking-tighter mb-6">Mindly</motion.h1>
          <motion.p variants={itemVariants} className="text-apple-muted text-2xl font-medium max-w-md leading-relaxed mx-auto">
            Design for the human mind.<br />
            Elevate your team's collective wellbeing.
          </motion.p>
          
          <div className="flex gap-4 justify-center mt-12">
            {['😄', '😊', '😐', '😔', '😢'].map((emoji, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.1 }}
                className="w-16 h-16 rounded-[1.8rem] glass shadow-apple flex items-center justify-center text-3xl"
              >
                {emoji}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right — Clean Form */}
      <div className="flex-1 flex items-center justify-center px-6 lg:px-20 relative z-20">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <motion.div variants={itemVariants} className="lg:hidden text-center mb-12">
            <div className="w-16 h-16 bg-apple-blue rounded-[1.5rem] flex items-center justify-center shadow-apple mx-auto mb-4">
               <span className="text-white text-2xl font-black">M</span>
            </div>
            <h1 className="text-3xl font-black text-apple-text tracking-tighter">Mindly</h1>
          </motion.div>

          <motion.h2 variants={itemVariants} className="text-4xl font-extrabold text-apple-text tracking-tight mb-2">
            {isRegister ? 'Join Mindly' : 'Sign In'}
          </motion.h2>
          <motion.p variants={itemVariants} className="text-apple-muted text-lg font-medium mb-10">
            {isRegister ? 'Start prioritizing your team\'s mental health.' : 'Welcome back to your space.'}
          </motion.p>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-mood-bad/10 text-mood-bad px-6 py-4 rounded-2xl mb-8 text-sm font-bold flex items-center gap-3 border border-mood-bad/10"
              >
                <ShieldCheck size={18} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {isRegister && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-6 overflow-hidden"
                >
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-apple-muted" size={20} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-black/5 border-none rounded-2xl pl-12 pr-6 py-4 text-apple-text placeholder:text-apple-muted/40 focus:ring-4 focus:ring-apple-blue/10 transition-all font-medium"
                      placeholder="Full Name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-sm font-bold text-apple-text tracking-tight px-1">Your Role</p>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { value: 'employee', label: 'Team', icon: UserIcon },
                        { value: 'hr', label: 'Admin', icon: Users },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setRole(opt.value)}
                          className={`p-5 rounded-[1.8rem] border-2 transition-all flex flex-col items-center gap-2 ${
                            role === opt.value
                              ? 'border-apple-blue bg-white shadow-apple'
                              : 'border-transparent bg-black/5 hover:bg-black/10'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${role === opt.value ? 'bg-apple-blue/10 text-apple-blue' : 'bg-black/5 text-apple-muted'}`}>
                             <opt.icon size={20} strokeWidth={2.5} />
                          </div>
                          <p className="font-bold text-apple-text text-sm">{opt.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-apple-muted" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/5 border-none rounded-2xl pl-12 pr-6 py-4 text-apple-text placeholder:text-apple-muted/40 focus:ring-4 focus:ring-apple-blue/10 transition-all font-medium"
                placeholder="Work Email"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-apple-muted" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/5 border-none rounded-2xl pl-12 pr-6 py-4 text-apple-text placeholder:text-apple-muted/40 focus:ring-4 focus:ring-apple-blue/10 transition-all font-medium"
                placeholder="Password"
                required
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-apple-text text-white font-bold py-4 rounded-2xl hover:bg-black transition-all shadow-apple-lg flex items-center justify-center gap-3 text-lg mt-4"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  {isRegister ? 'Join the Community' : 'Sign In to Mindly'}
                  <ArrowRight size={20} strokeWidth={3} />
                </>
              )}
            </motion.button>
          </form>

          <motion.p variants={itemVariants} className="text-center mt-10 text-apple-muted font-medium">
            {isRegister ? 'Already part of the team?' : "New to Mindly?"}{' '}
            <button
              onClick={() => { setIsRegister(!isRegister); setError('') }}
              className="text-apple-blue font-bold hover:underline"
            >
              {isRegister ? 'Sign in' : 'Create an account'}
            </button>
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}
