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

  const isColorField = ['skin', 'hairColor', 'bg'].includes(activeSection)
  const colorMap = activeSection === 'skin' ? SKIN_COLORS
    : activeSection === 'hairColor' ? HAIR_COLOR_VALUES
    : BG_COLOR_VALUES

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen px-6 md:px-10 py-8 md:py-14 max-w-3xl mx-auto"
    >
      <motion.button
        variants={itemVariants}
        onClick={onBack}
        className="flex items-center gap-1.5 text-ink-muted hover:text-ink mb-8 text-sm font-medium transition-colors group"
      >
        <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        Back
      </motion.button>

      <motion.h1 variants={itemVariants} className="font-display text-4xl text-ink mb-10">
        Create your avatar
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Preview */}
        <motion.div variants={itemVariants} className="flex flex-col items-center">
          <div className="card-flat p-8 w-full flex flex-col items-center">
            <Avatar config={config} size={180} className="rounded-3xl shadow-elevated mb-4" />
            <p className="text-sm font-medium text-ink-muted">Preview</p>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSave}
            disabled={saving}
            className="w-full mt-4 btn-primary py-4 flex items-center justify-center gap-2 text-base disabled:opacity-50"
          >
            {saving ? '...' : (
              <>
                <Check size={18} />
                Save Avatar
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Controls */}
        <motion.div variants={itemVariants}>
          <div className="flex flex-wrap gap-1.5 mb-6">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeSection === s.id
                    ? 'bg-primary text-white'
                    : 'bg-surface-sunken text-ink-muted hover:bg-border'
                }`}
              >
                <s.icon size={13} />
                {s.label}
              </button>
            ))}
          </div>

          <div className="card-flat p-5">
            <p className="text-[11px] font-medium text-ink-muted uppercase tracking-wider mb-4">
              {SECTIONS.find((s) => s.id === activeSection)?.label}
            </p>

            {isColorField ? (
              <div className="grid grid-cols-4 gap-2.5">
                {AVATAR_OPTIONS[activeSection].map((key) => {
                  const selected = config[activeSection] === key
                  return (
                    <button
                      key={key}
                      onClick={() => updateField(activeSection, key)}
                      className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl transition-all ${
                        selected ? 'ring-2 ring-primary ring-offset-2' : 'hover:bg-surface-sunken'
                      }`}
                    >
                      <div
                        className="w-9 h-9 rounded-full border-2"
                        style={{
                          backgroundColor: colorMap[key],
                          borderColor: selected ? '#E8604C' : 'rgba(0,0,0,0.05)',
                        }}
                      />
                      <span className="text-[10px] font-medium text-ink-muted">
                        {LABELS[activeSection]?.[key] || key}
                      </span>
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                {AVATAR_OPTIONS[activeSection].map((key) => {
                  const selected = config[activeSection] === key
                  const previewConfig = { ...config, [activeSection]: key }
                  return (
                    <button
                      key={key}
                      onClick={() => updateField(activeSection, key)}
                      className={`flex items-center gap-2.5 p-3 rounded-xl transition-all text-left ${
                        selected
                          ? 'bg-primary text-white'
                          : 'bg-surface-sunken hover:bg-border text-ink'
                      }`}
                    >
                      <Avatar config={previewConfig} size={32} className="rounded-lg" />
                      <span className="text-sm font-medium capitalize">
                        {LABELS[activeSection]?.[key] || key}
                      </span>
                      {selected && <Check size={14} className="ml-auto" />}
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
