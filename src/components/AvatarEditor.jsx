import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, ChevronLeft, Palette, Scissors, Eye, Smile, Sparkles, Image } from 'lucide-react'
import { Avatar, AVATAR_OPTIONS, SKIN_COLORS, HAIR_COLOR_VALUES, BG_COLOR_VALUES } from './Avatar'

const SECTIONS = [
  { id: 'skin', label: 'Skin', icon: Palette },
  { id: 'hair', label: 'Hair', icon: Scissors },
  { id: 'hairColor', label: 'Color', icon: Palette },
  { id: 'eyes', label: 'Eyes', icon: Eye },
  { id: 'mouth', label: 'Mouth', icon: Smile },
  { id: 'accessory', label: 'Extras', icon: Sparkles },
  { id: 'bg', label: 'Background', icon: Image },
]

const LABELS = {
  skin: { light: 'Light', fair: 'Fair', medium: 'Medium', tan: 'Tan', brown: 'Brown', dark: 'Dark' },
  hair: { none: 'Bald', buzz: 'Buzz', short: 'Short', medium: 'Medium', long: 'Long', curly: 'Curly', bun: 'Bun' },
  hairColor: { black: 'Black', brown: 'Brown', auburn: 'Auburn', blonde: 'Blonde', ginger: 'Ginger', gray: 'Gray', blue: 'Blue', pink: 'Pink' },
  eyes: { normal: 'Classic', happy: 'Happy', wide: 'Wide', wink: 'Wink' },
  mouth: { smile: 'Smile', grin: 'Grin', neutral: 'Neutral', smirk: 'Smirk' },
  accessory: { none: 'None', glasses: 'Glasses', sunglasses: 'Shades' },
  bg: { blue: 'Sky', green: 'Mint', lavender: 'Lavender', peach: 'Peach', pink: 'Rose', yellow: 'Sun', mint: 'Teal', gray: 'Stone' },
}

export default function AvatarEditor({ initialConfig, onSave, onBack }) {
  const [config, setConfig] = useState({
    skin: 'fair',
    hair: 'short',
    hairColor: 'brown',
    eyes: 'normal',
    mouth: 'smile',
    accessory: 'none',
    bg: 'blue',
    ...initialConfig,
  })
  const [activeSection, setActiveSection] = useState('skin')
  const [saving, setSaving] = useState(false)

  const updateField = (field, value) => {
    setConfig((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(config)
    } finally {
      setSaving(false)
    }
  }

  // Render color swatches for skin, hairColor, bg
  const isColorField = ['skin', 'hairColor', 'bg'].includes(activeSection)
  const colorMap = activeSection === 'skin' ? SKIN_COLORS
    : activeSection === 'hairColor' ? HAIR_COLOR_VALUES
    : BG_COLOR_VALUES

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen px-6 md:px-12 py-8 md:py-16 max-w-3xl mx-auto"
    >
      {/* Back */}
      <motion.button
        variants={itemVariants}
        onClick={onBack}
        className="flex items-center gap-2 text-apple-muted hover:text-apple-text mb-10 text-sm font-bold uppercase tracking-widest transition-colors group"
      >
        <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back
      </motion.button>

      <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-extrabold text-apple-text tracking-tight mb-12">
        Create your avatar
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Preview */}
        <motion.div variants={itemVariants} className="flex flex-col items-center">
          <div className="apple-card p-8 w-full flex flex-col items-center">
            <Avatar config={config} size={200} className="rounded-[2.5rem] shadow-apple-lg mb-6" />
            <p className="text-sm font-bold text-apple-muted">Preview</p>
          </div>

          {/* Save button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={saving}
            className="w-full mt-6 bg-apple-text text-white font-bold py-4 rounded-2xl shadow-apple-lg flex items-center justify-center gap-3 hover:bg-black disabled:opacity-50"
          >
            {saving ? '...' : (
              <>
                <Check size={20} strokeWidth={3} />
                Save Avatar
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Controls */}
        <motion.div variants={itemVariants}>
          {/* Section tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all ${
                  activeSection === s.id
                    ? 'bg-apple-blue text-white shadow-apple'
                    : 'bg-black/5 text-apple-muted hover:bg-black/10'
                }`}
              >
                <s.icon size={14} strokeWidth={2.5} />
                {s.label}
              </button>
            ))}
          </div>

          {/* Options */}
          <div className="apple-card p-6">
            <p className="text-[10px] font-black text-apple-muted uppercase tracking-[0.2em] mb-5">
              {SECTIONS.find((s) => s.id === activeSection)?.label}
            </p>

            {isColorField ? (
              /* Color swatches */
              <div className="grid grid-cols-4 gap-3">
                {AVATAR_OPTIONS[activeSection].map((key) => {
                  const selected = config[activeSection] === key
                  return (
                    <button
                      key={key}
                      onClick={() => updateField(activeSection, key)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${
                        selected ? 'ring-2 ring-apple-blue ring-offset-2 scale-105' : 'hover:bg-black/5'
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-full shadow-sm border-2"
                        style={{
                          backgroundColor: colorMap[key],
                          borderColor: selected ? '#007AFF' : 'rgba(0,0,0,0.05)',
                        }}
                      />
                      <span className="text-[10px] font-bold text-apple-muted uppercase tracking-wider">
                        {LABELS[activeSection]?.[key] || key}
                      </span>
                    </button>
                  )
                })}
              </div>
            ) : (
              /* Icon/label options */
              <div className="grid grid-cols-2 gap-3">
                {AVATAR_OPTIONS[activeSection].map((key) => {
                  const selected = config[activeSection] === key
                  // Show a mini preview for each option
                  const previewConfig = { ...config, [activeSection]: key }
                  return (
                    <button
                      key={key}
                      onClick={() => updateField(activeSection, key)}
                      className={`flex items-center gap-3 p-4 rounded-2xl transition-all text-left ${
                        selected
                          ? 'bg-apple-blue text-white shadow-apple'
                          : 'bg-black/5 hover:bg-black/10 text-apple-text'
                      }`}
                    >
                      <Avatar config={previewConfig} size={36} className="rounded-xl" />
                      <span className="text-sm font-bold capitalize">
                        {LABELS[activeSection]?.[key] || key}
                      </span>
                      {selected && <Check size={16} className="ml-auto" strokeWidth={3} />}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
