import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Brain, RefreshCw, AlertCircle } from 'lucide-react'
import { useAIAgent } from '../hooks/useAIAgent'

export default function HRAIInsights({ checkins, members }) {
  const { insight, loading, error } = useAIAgent(checkins, members)

  return (
    <div className="card-flat p-8 relative overflow-hidden group">
      {/* Background Glow Effect */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-apple-blue/5 rounded-full blur-3xl group-hover:bg-apple-blue/10 transition-colors duration-700" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-apple-blue/10 flex items-center justify-center text-apple-blue shadow-inner">
              <Sparkles size={20} className={loading ? "animate-pulse" : ""} />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-apple-text tracking-tight">AI Team Recap</h2>
              <p className="text-[10px] font-bold text-apple-muted uppercase tracking-[0.2em]">Generated Daily</p>
            </div>
          </div>
          
          {loading && (
            <div className="flex items-center gap-2 text-apple-muted animate-pulse">
              <RefreshCw size={14} className="animate-spin" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Analyzing Pulse...</span>
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <div className="h-4 bg-black/5 rounded-full w-3/4 animate-pulse" />
              <div className="h-4 bg-black/5 rounded-full w-full animate-pulse" />
              <div className="h-4 bg-black/5 rounded-full w-2/3 animate-pulse" />
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 text-mood-bad bg-mood-bad/5 p-4 rounded-2xl border border-mood-bad/10"
            >
              <AlertCircle size={18} />
              <p className="text-sm font-bold">{error}</p>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="bg-gradient-to-br from-white/50 to-transparent p-6 rounded-[2rem] border border-white shadow-sm">
                <p className="text-lg font-medium text-apple-text leading-relaxed italic italic-serif">
                  "{insight}"
                </p>
              </div>
              
              <div className="mt-6 flex items-center gap-4">
                <div className="px-3 py-1 bg-apple-blue/5 rounded-full text-[9px] font-black text-apple-blue uppercase tracking-widest border border-apple-blue/10">
                  Strands Agent v1.0
                </div>
                <div className="text-[9px] font-bold text-apple-muted uppercase tracking-widest">
                  Based on {checkins.length} check-ins this week
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
