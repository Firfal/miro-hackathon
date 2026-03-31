import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Check, Moon, Sun, Send } from 'lucide-react'
import { checkInQuestions, moodConfig } from '../data/mockData'

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
          className="absolute inset-0 bg-white/40 backdrop-blur-3xl" 
        />
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="relative text-center max-w-sm"
        >
          <div className="w-24 h-24 bg-apple-blue rounded-[2rem] flex items-center justify-center text-white text-5xl shadow-apple-lg mx-auto mb-8">
            <Check size={48} strokeWidth={3} />
          </div>
          <h2 className="text-4xl font-extrabold text-apple-text tracking-tight mb-4 text-balance">Reflection complete</h2>
          <p className="text-apple-muted text-lg font-medium mb-10 leading-relaxed">
            Thank you for taking a moment to check in with yourself.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-apple-text text-white py-4 rounded-2xl font-bold text-lg hover:bg-black transition-colors shadow-apple"
          >
            Back to Dashboard
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/30 backdrop-blur-sm" 
        onClick={onClose} 
      />

      {/* Modal */}
      <motion.div 
        initial={{ y: 100, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 100, opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative bg-white/90 backdrop-blur-2xl rounded-[3rem] w-full max-w-2xl shadow-apple-lg overflow-hidden border border-white"
      >
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-black/5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="h-full bg-apple-blue rounded-r-full"
          />
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-8 right-8 w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-apple-muted hover:text-apple-text hover:bg-black/10 transition-all z-10"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="p-8 md:p-16 min-h-[460px] flex flex-col">
          <motion.div 
            key={step}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1"
          >
            <p className="text-xs font-bold text-apple-blue uppercase tracking-[0.2em] mb-4">
              Step {step + 1} of {totalSteps}
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-apple-text tracking-tight mb-4 leading-tight">
              {question.question}
            </h2>
            <p className="text-apple-muted text-lg font-medium mb-12">{question.subtitle}</p>

            <div className="flex-1">
              {/* Mood select */}
              {question.id === 'mood' && (
                <div className="grid grid-cols-5 gap-4">
                  {Object.entries(moodConfig).map(([key, cfg]) => {
                    const selected = responses[question.id] === key
                    return (
                      <motion.button
                        key={key}
                        whileHover={{ y: -4, scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setAnswer(key)}
                        className={`flex flex-col items-center gap-3 p-4 py-6 rounded-3xl border-2 transition-all duration-300 ${
                          selected
                            ? 'border-apple-blue shadow-apple'
                            : 'border-transparent hover:bg-black/5'
                        }`}
                        style={{ backgroundColor: selected ? cfg.bg : 'transparent' }}
                      >
                        <span className="text-5xl mb-2 drop-shadow-md">{cfg.emoji}</span>
                        <span className="text-xs font-bold text-apple-text tracking-tight">{cfg.label}</span>
                      </motion.button>
                    )
                  })}
                </div>
              )}

              {/* Slider */}
              {question.type === 'slider' && (
                <div className="py-10">
                  <div className="flex justify-between items-center mb-10 px-4">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-3xl">{question.lowEmoji}</span>
                      <span className="text-[10px] font-bold text-apple-muted uppercase tracking-widest">{question.lowLabel}</span>
                    </div>
                    <motion.span 
                      key={responses[question.id]}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-7xl font-black text-apple-text tracking-tighter"
                    >
                      {responses[question.id] || 5}
                    </motion.span>
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-3xl">{question.highEmoji}</span>
                      <span className="text-[10px] font-bold text-apple-muted uppercase tracking-widest">{question.highLabel}</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={question.min}
                    max={question.max}
                    value={responses[question.id] || 5}
                    onChange={(e) => setAnswer(parseInt(e.target.value))}
                    className="w-full cursor-pointer h-2 bg-black/10 rounded-full appearance-none"
                  />
                </div>
              )}

              {/* Yes/No */}
              {question.type === 'yes-no' && (
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { value: 'yes', label: 'Yes', icon: Sun, desc: 'Rested and ready', color: 'text-mood-okay', bg: 'bg-mood-okay/10' },
                    { value: 'no', label: 'No', icon: Moon, desc: 'Feeling tired', color: 'text-apple-blue', bg: 'bg-apple-blue/10' },
                  ].map((opt) => (
                    <motion.button
                      key={opt.value}
                      whileHover={{ y: -4, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setAnswer(opt.value)}
                      className={`p-8 rounded-[2.5rem] font-bold transition-all flex flex-col items-center gap-4 border-2 ${
                        responses[question.id] === opt.value
                          ? 'border-apple-blue bg-white shadow-apple'
                          : 'border-transparent bg-black/5 hover:bg-black/10'
                      }`}
                    >
                      <div className={`w-16 h-16 rounded-2xl ${opt.bg} flex items-center justify-center ${opt.color}`}>
                        <opt.icon size={32} strokeWidth={2.5} />
                      </div>
                      <div className="text-center">
                        <span className="text-xl font-bold text-apple-text">{opt.label}</span>
                        <p className="text-xs text-apple-muted mt-1">{opt.desc}</p>
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
                  className="w-full h-48 bg-black/5 border-none rounded-3xl p-8 text-apple-text placeholder:text-apple-muted/40 focus:ring-4 focus:ring-apple-blue/10 transition-all resize-none text-lg leading-relaxed font-medium"
                />
              )}
            </div>
          </motion.div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-12">
            <button
              onClick={() => step > 0 && setStep(step - 1)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
                step > 0 ? 'text-apple-muted hover:text-apple-text hover:bg-black/5' : 'invisible'
              }`}
            >
              <ChevronLeft size={18} />
              Back
            </button>
            <motion.button
              whileHover={canProceed() ? { scale: 1.05 } : {}}
              whileTap={canProceed() ? { scale: 0.95 } : {}}
              onClick={next}
              disabled={!canProceed()}
              className={`flex items-center gap-3 px-10 py-4 rounded-2xl font-bold text-lg transition-all shadow-apple ${
                canProceed()
                  ? 'bg-apple-blue text-white hover:bg-blue-600 active:scale-95 shadow-apple-lg'
                  : 'bg-black/5 text-apple-muted/30 cursor-not-allowed shadow-none'
              }`}
            >
              {step < totalSteps - 1 ? (
                <>
                  Next Step
                  <ChevronRight size={20} strokeWidth={3} />
                </>
              ) : (
                <>
                  Complete
                  <Send size={20} strokeWidth={3} />
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
