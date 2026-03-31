// Renders a custom SVG avatar based on config
// Config shape: { skin, hair, hairColor, eyes, mouth, accessory, bg }

const SKINS = {
  light:   '#FDDCB5',
  fair:    '#F5C9A0',
  medium:  '#E0A872',
  tan:     '#C68642',
  brown:   '#8D5524',
  dark:    '#5C3310',
}

const HAIR_COLORS = {
  black:   '#1A1A2E',
  brown:   '#6B3A2A',
  auburn:  '#922B21',
  blonde:  '#D4A843',
  ginger:  '#D35400',
  gray:    '#95A5A6',
  blue:    '#5DADE2',
  pink:    '#E91E8C',
}

const BG_COLORS = {
  blue:    '#E8EAFD',
  green:   '#E2F5EC',
  lavender:'#F1E9FA',
  peach:   '#FDF0E4',
  pink:    '#FDE7EA',
  yellow:  '#FDF5E0',
  mint:    '#E6F8F2',
  gray:    '#F2EFEA',
}

// Hair style SVG paths
function HairSVG({ style, color }) {
  switch (style) {
    case 'short':
      return (
        <g fill={color}>
          <ellipse cx="50" cy="28" rx="28" ry="18" />
          <rect x="22" y="20" width="56" height="14" rx="4" />
        </g>
      )
    case 'medium':
      return (
        <g fill={color}>
          <ellipse cx="50" cy="26" rx="30" ry="20" />
          <path d="M20 35 Q20 55 24 65 L22 35Z" />
          <path d="M80 35 Q80 55 76 65 L78 35Z" />
        </g>
      )
    case 'long':
      return (
        <g fill={color}>
          <ellipse cx="50" cy="26" rx="30" ry="20" />
          <path d="M20 30 Q18 60 22 80 L26 80 Q22 60 24 30Z" />
          <path d="M80 30 Q82 60 78 80 L74 80 Q78 60 76 30Z" />
        </g>
      )
    case 'curly':
      return (
        <g fill={color}>
          <circle cx="30" cy="24" r="12" />
          <circle cx="50" cy="20" r="14" />
          <circle cx="70" cy="24" r="12" />
          <circle cx="24" cy="36" r="8" />
          <circle cx="76" cy="36" r="8" />
        </g>
      )
    case 'buzz':
      return (
        <g fill={color}>
          <path d="M24 38 Q24 18 50 16 Q76 18 76 38 L74 34 Q74 22 50 20 Q26 22 26 34Z" />
        </g>
      )
    case 'bun':
      return (
        <g fill={color}>
          <ellipse cx="50" cy="26" rx="28" ry="16" />
          <circle cx="50" cy="12" r="10" />
        </g>
      )
    case 'none':
    default:
      return null
  }
}

// Eyes SVG
function EyesSVG({ style }) {
  switch (style) {
    case 'normal':
      return (
        <g>
          <circle cx="38" cy="46" r="3" fill="#1A1A2E" />
          <circle cx="62" cy="46" r="3" fill="#1A1A2E" />
          <circle cx="39" cy="45" r="1" fill="white" />
          <circle cx="63" cy="45" r="1" fill="white" />
        </g>
      )
    case 'happy':
      return (
        <g stroke="#1A1A2E" strokeWidth="2.5" strokeLinecap="round" fill="none">
          <path d="M34 46 Q38 42 42 46" />
          <path d="M58 46 Q62 42 66 46" />
        </g>
      )
    case 'wide':
      return (
        <g>
          <ellipse cx="38" cy="46" rx="4" ry="5" fill="white" stroke="#1A1A2E" strokeWidth="1.5" />
          <ellipse cx="62" cy="46" rx="4" ry="5" fill="white" stroke="#1A1A2E" strokeWidth="1.5" />
          <circle cx="38" cy="46" r="2.5" fill="#1A1A2E" />
          <circle cx="62" cy="46" r="2.5" fill="#1A1A2E" />
        </g>
      )
    case 'wink':
      return (
        <g>
          <circle cx="38" cy="46" r="3" fill="#1A1A2E" />
          <circle cx="39" cy="45" r="1" fill="white" />
          <path d="M58 46 Q62 42 66 46" stroke="#1A1A2E" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </g>
      )
    default:
      return <EyesSVG style="normal" />
  }
}

// Mouth SVG
function MouthSVG({ style }) {
  switch (style) {
    case 'smile':
      return <path d="M40 58 Q50 66 60 58" stroke="#1A1A2E" strokeWidth="2" strokeLinecap="round" fill="none" />
    case 'grin':
      return (
        <g>
          <path d="M38 57 Q50 68 62 57" fill="white" stroke="#1A1A2E" strokeWidth="1.5" />
          <path d="M38 57 Q50 62 62 57" fill="#1A1A2E" stroke="none" />
        </g>
      )
    case 'neutral':
      return <line x1="42" y1="59" x2="58" y2="59" stroke="#1A1A2E" strokeWidth="2" strokeLinecap="round" />
    case 'smirk':
      return <path d="M42 58 Q52 64 60 56" stroke="#1A1A2E" strokeWidth="2" strokeLinecap="round" fill="none" />
    default:
      return <MouthSVG style="smile" />
  }
}

// Accessory SVG
function AccessorySVG({ style }) {
  switch (style) {
    case 'glasses':
      return (
        <g fill="none" stroke="#1A1A2E" strokeWidth="1.8">
          <circle cx="38" cy="46" r="8" />
          <circle cx="62" cy="46" r="8" />
          <path d="M46 46 L54 46" />
          <path d="M30 46 L22 44" />
          <path d="M70 46 L78 44" />
        </g>
      )
    case 'sunglasses':
      return (
        <g>
          <rect x="28" y="40" width="18" height="12" rx="3" fill="#1A1A2E" />
          <rect x="54" y="40" width="18" height="12" rx="3" fill="#1A1A2E" />
          <path d="M46 46 L54 46" stroke="#1A1A2E" strokeWidth="2" />
          <path d="M28 44 L22 42" stroke="#1A1A2E" strokeWidth="2" />
          <path d="M72 44 L78 42" stroke="#1A1A2E" strokeWidth="2" />
        </g>
      )
    case 'none':
    default:
      return null
  }
}

export function Avatar({ config, size = 40, className = '' }) {
  const c = {
    skin: 'fair',
    hair: 'short',
    hairColor: 'brown',
    eyes: 'normal',
    mouth: 'smile',
    accessory: 'none',
    bg: 'blue',
    ...config,
  }

  const bgColor = BG_COLORS[c.bg] || BG_COLORS.blue
  const skinColor = SKINS[c.skin] || SKINS.fair
  const hairClr = HAIR_COLORS[c.hairColor] || HAIR_COLORS.brown

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`rounded-2xl flex-shrink-0 ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      {/* Neck */}
      <rect x="42" y="68" width="16" height="12" rx="4" fill={skinColor} />

      {/* Face */}
      <ellipse cx="50" cy="48" rx="24" ry="26" fill={skinColor} />

      {/* Ears */}
      <ellipse cx="26" cy="48" rx="4" ry="6" fill={skinColor} />
      <ellipse cx="74" cy="48" rx="4" ry="6" fill={skinColor} />

      {/* Hair (behind accessories but on top of face) */}
      <HairSVG style={c.hair} color={hairClr} />

      {/* Eyebrows */}
      <line x1="33" y1="38" x2="43" y2="37" stroke="#1A1A2E" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <line x1="57" y1="37" x2="67" y2="38" stroke="#1A1A2E" strokeWidth="2" strokeLinecap="round" opacity="0.4" />

      {/* Eyes */}
      <EyesSVG style={c.eyes} />

      {/* Nose */}
      <path d="M48 52 Q50 55 52 52" stroke="#1A1A2E" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.3" />

      {/* Mouth */}
      <MouthSVG style={c.mouth} />

      {/* Accessory */}
      <AccessorySVG style={c.accessory} />

      {/* Blush */}
      <circle cx="32" cy="54" r="5" fill="#F5A6A6" opacity="0.2" />
      <circle cx="68" cy="54" r="5" fill="#F5A6A6" opacity="0.2" />
    </svg>
  )
}

// Export options for the editor
export const AVATAR_OPTIONS = {
  skin: Object.keys(SKINS),
  hair: ['none', 'buzz', 'short', 'medium', 'long', 'curly', 'bun'],
  hairColor: Object.keys(HAIR_COLORS),
  eyes: ['normal', 'happy', 'wide', 'wink'],
  mouth: ['smile', 'grin', 'neutral', 'smirk'],
  accessory: ['none', 'glasses', 'sunglasses'],
  bg: Object.keys(BG_COLORS),
}

export const SKIN_COLORS = SKINS
export const HAIR_COLOR_VALUES = HAIR_COLORS
export const BG_COLOR_VALUES = BG_COLORS
