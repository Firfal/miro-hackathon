import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, RefreshCw, AlertCircle } from 'lucide-react'
import { useAIAgent } from '../hooks/useAIAgent'

export default function HRAIInsights({ checkins, members }) {
  const { insight, loading, error } = useAIAgent(checkins, members)

  return (
    <div className="card-flat p-6 relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-secondary-light flex items-center justify-center text-secondary">
              <Sparkles size={18} className={loading ? "animate-pulse" : ""} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-ink">AI Team Recap</h2>
              <p className="text-[10px] font-medium text-ink-muted uppercase tracking-wider">Generated daily</p>
            </div>
          </div>

          {loading && (
            <div className="flex items-center gap-2 text-ink-muted animate-pulse">
              <RefreshCw size={13} className="animate-spin" />
              <span className="text-[10px] font-medium uppercase tracking-wider">Analyzing...</span>
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
              className="space-y-2.5"
            >
              <div className="h-3.5 bg-surface-sunken rounded-full w-3/4 animate-pulse" />
              <div className="h-3.5 bg-surface-sunken rounded-full w-full animate-pulse" />
              <div className="h-3.5 bg-surface-sunken rounded-full w-2/3 animate-pulse" />
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2.5 text-mood-bad bg-pastel-red p-4 rounded-xl border border-mood-bad/10"
            >
              <AlertCircle size={16} />
              <p className="text-sm font-medium">{error}</p>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="bg-surface-sunken p-5 rounded-xl">
                <p className="text-sm text-ink leading-relaxed font-display italic">
                  "{insight}"
                </p>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <span className="px-2.5 py-1 bg-secondary-light rounded-md text-[9px] font-semibold text-secondary uppercase tracking-wider">
                  Strands Agent v1.0
                </span>
                <span className="text-[10px] font-medium text-ink-muted">
                  Based on {checkins.length} check-ins this week
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
