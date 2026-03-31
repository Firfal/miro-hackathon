import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Moon, Sun, Send } from 'lucide-react'
import { checkInQuestions, moodConfig } from '../data/mockData'
import { MoodFace, CheckInCompleteIllustration } from './Illustrations'

export default function CheckIn({ onComplete, onClose }) {
  const [step, setStep] = useState(0)
  const [responses, setResponses] = useState({})
  const [completed, setCompleted] = useState(false)
  const question = checkInQuestions[step]
  const totalSteps = checkInQuestions.length
  const progress = ((step + 1) / totalSteps) * 100

  const setAnswer = (value) => {
    setResponses((prev) => ({ ...prev, [question.id]: value }))
  }

  const next = async () => {
    if (step < totalSteps - 1) {
      setStep(step + 1)
    } else {
      setCompleted(true)
      try {
        await onComplete(responses)
      } catch (e) {
        console.error('Check-in save failed:', e)
      }
    }
  }

  const canProceed = () => {
    if (question.type === 'text') return true
    return responses[question.id] !== undefined
  }

  if (completed) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-surface/90"
        />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 20 }}
          className="relative text-center max-w-sm"
        >
          <CheckInCompleteIllustration className="w-48 h-48 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-ink tracking-tight mb-3">Reflection complete</h2>
          <p className="text-ink-muted text-base mb-8 leading-relaxed">
            Thank you for taking a moment to check in with yourself.
          </p>
          <button
            onClick={onClose}
            className="w-full btn-primary py-4 text-base"
          >
            Back to Dashboard
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="relative bg-white rounded-3xl w-full max-w-2xl shadow-float overflow-hidden border border-border-subtle"
      >
        {/* Progress */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-surface-sunken">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="h-full bg-primary rounded-r-full"
          />
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-9 h-9 rounded-lg bg-surface-sunken flex items-center justify-center text-ink-muted hover:text-ink transition-colors z-10"
        >
          <X size={18} />
        </button>

        {/* Content */}
        <div className="p-6 md:p-12 min-h-[440px] flex flex-col">
          <motion.div
            key={step}
            initial={{ x: 16, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -16, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1"
          >
            <p className="text-xs font-medium text-primary uppercase tracking-wider mb-3">
              Step {step + 1} of {totalSteps}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-ink tracking-tight mb-2 leading-snug">
              {question.question}
            </h2>
            <p className="text-ink-muted text-base mb-10">{question.subtitle}</p>

            <div className="flex-1">
              {/* Mood select */}
              {question.id === 'mood' && (
                <div className="grid grid-cols-5 gap-3">
                  {Object.entries(moodConfig).map(([key, cfg]) => {
                    const selected = responses[question.id] === key
                    return (
                      <motion.button
                        key={key}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setAnswer(key)}
                        className={`flex flex-col items-center gap-2 p-3 py-5 rounded-xl border-2 transition-all duration-200 ${
                          selected
                            ? 'border-primary shadow-glow'
                            : 'border-transparent hover:bg-surface-sunken'
                        }`}
                        style={{ backgroundColor: selected ? cfg.bg : 'transparent' }}
                      >
                        <MoodFace mood={key} size={44} />
                        <span className="text-xs font-medium text-ink">{cfg.label}</span>
                      </motion.button>
                    )
                  })}
                </div>
              )}

              {/* Slider */}
              {question.type === 'slider' && (
                <div className="py-8">
                  <div className="flex justify-between items-center mb-8 px-2">
                    <div className="flex flex-col items-center gap-1.5">
                      <span className="text-2xl">{question.lowEmoji}</span>
                      <span className="text-[10px] font-medium text-ink-muted uppercase tracking-wider">{question.lowLabel}</span>
                    </div>
                    <motion.span
                      key={responses[question.id]}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-5xl font-bold text-ink"
                    >
                      {responses[question.id] || 5}
                    </motion.span>
                    <div className="flex flex-col items-center gap-1.5">
                      <span className="text-2xl">{question.highEmoji}</span>
                      <span className="text-[10px] font-medium text-ink-muted uppercase tracking-wider">{question.highLabel}</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={question.min}
                    max={question.max}
                    value={responses[question.id] || 5}
                    onChange={(e) => setAnswer(parseInt(e.target.value))}
                    className="w-full cursor-pointer"
                  />
                </div>
              )}

              {/* Yes/No */}
              {question.type === 'yes-no' && (
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: 'yes', label: 'Yes', icon: Sun, desc: 'Rested and ready', color: 'text-accent-amber', bg: 'bg-pastel-yellow' },
                    { value: 'no', label: 'No', icon: Moon, desc: 'Feeling tired', color: 'text-accent-indigo', bg: 'bg-secondary-light' },
                  ].map((opt) => (
                    <motion.button
                      key={opt.value}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setAnswer(opt.value)}
                      className={`p-6 rounded-xl font-semibold transition-all flex flex-col items-center gap-3 border-2 ${
                        responses[question.id] === opt.value
                          ? 'border-primary bg-primary-light'
                          : 'border-border bg-white hover:border-ink-faint'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-lg ${opt.bg} flex items-center justify-center ${opt.color}`}>
                        <opt.icon size={24} />
                      </div>
                      <div className="text-center">
                        <span className="text-lg font-semibold text-ink">{opt.label}</span>
                        <p className="text-xs text-ink-muted mt-0.5">{opt.desc}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Text */}
              {question.type === 'text' && (
                <textarea
                  value={responses[question.id] || ''}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="The floor is yours..."
                  className="w-full h-40 input-field rounded-xl p-5 resize-none text-base leading-relaxed"
                />
              )}
            </div>
          </motion.div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-10">
            <button
              onClick={() => step > 0 && setStep(step - 1)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                step > 0 ? 'text-ink-muted hover:text-ink hover:bg-surface-sunken' : 'invisible'
              }`}
            >
              <ChevronLeft size={16} />
              Back
            </button>
            <motion.button
              whileTap={canProceed() ? { scale: 0.97 } : {}}
              onClick={next}
              disabled={!canProceed()}
              className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-base transition-all ${
                canProceed()
                  ? 'btn-primary shadow-elevated'
                  : 'bg-surface-sunken text-ink-faint cursor-not-allowed'
              }`}
            >
              {step < totalSteps - 1 ? (
                <>
                  Next
                  <ChevronRight size={18} />
                </>
              ) : (
                <>
                  Complete
                  <Send size={18} />
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
