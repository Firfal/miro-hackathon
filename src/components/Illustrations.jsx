// Hand-crafted SVG illustrations for Mindly
// Each has organic shapes, warm colors, and slight asymmetry for a human feel

export function WelcomeIllustration({ className = '' }) {
  return (
    <svg viewBox="0 0 320 280" fill="none" className={className}>
      {/* Warm sun */}
      <circle cx="160" cy="90" r="48" fill="#F5C542" opacity="0.15" />
      <circle cx="160" cy="90" r="32" fill="#F5C542" opacity="0.25" />
      <circle cx="160" cy="90" r="18" fill="#F5C542" />

      {/* Sun rays — organic, not perfect */}
      <path d="M160 58 L158 42 L163 43Z" fill="#F5C542" opacity="0.6" />
      <path d="M160 122 L162 138 L157 137Z" fill="#F5C542" opacity="0.6" />
      <path d="M128 90 L112 88 L113 93Z" fill="#F5C542" opacity="0.6" />
      <path d="M192 90 L208 92 L207 87Z" fill="#F5C542" opacity="0.6" />
      <path d="M138 68 L126 56 L130 53Z" fill="#F5C542" opacity="0.4" />
      <path d="M182 112 L194 124 L190 127Z" fill="#F5C542" opacity="0.4" />
      <path d="M182 68 L194 56 L190 53Z" fill="#F5C542" opacity="0.4" />
      <path d="M138 112 L126 124 L130 127Z" fill="#F5C542" opacity="0.4" />

      {/* Ground / horizon — organic curve */}
      <path d="M0 210 Q80 185 160 195 Q240 205 320 190 L320 280 L0 280Z" fill="#E2F5EC" />
      <path d="M0 220 Q80 200 160 210 Q240 220 320 205 L320 280 L0 280Z" fill="#2DB67D" opacity="0.12" />

      {/* Plant stem — slightly curved */}
      <path d="M155 210 Q152 175 156 150" stroke="#2DB67D" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* Leaves — organic, asymmetric */}
      <path d="M156 170 Q140 155 145 145 Q155 150 156 170Z" fill="#2DB67D" opacity="0.7" />
      <path d="M155 185 Q170 172 175 162 Q165 170 155 185Z" fill="#2DB67D" opacity="0.5" />
      <path d="M156 155 Q165 138 172 135 Q168 148 156 155Z" fill="#2DB67D" opacity="0.6" />

      {/* Small flower */}
      <circle cx="156" cy="145" r="5" fill="#E8604C" opacity="0.8" />
      <circle cx="156" cy="145" r="2.5" fill="#F5C542" />

      {/* Floating dots — playful */}
      <circle cx="90" cy="120" r="3" fill="#5B6CF0" opacity="0.3" />
      <circle cx="230" cy="100" r="2.5" fill="#E8604C" opacity="0.25" />
      <circle cx="110" cy="160" r="2" fill="#F5C542" opacity="0.35" />
      <circle cx="210" cy="150" r="3.5" fill="#2DB67D" opacity="0.2" />
      <circle cx="250" cy="170" r="2" fill="#5B6CF0" opacity="0.2" />

      {/* Small birds — simple, sketchy */}
      <path d="M95 75 Q100 70 105 75" stroke="#1D1D1F" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.2" />
      <path d="M215 60 Q220 55 225 60" stroke="#1D1D1F" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.15" />
    </svg>
  )
}

export function CheckInCompleteIllustration({ className = '' }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className}>
      {/* Soft background circle */}
      <circle cx="100" cy="95" r="60" fill="#E2F5EC" />

      {/* Person sitting — minimalist */}
      {/* Body */}
      <path d="M90 105 Q85 85 95 75" stroke="#1D1D1F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Head */}
      <circle cx="97" cy="68" r="10" fill="#FAF8F5" stroke="#1D1D1F" strokeWidth="2" />
      {/* Happy eyes */}
      <path d="M93 67 Q95 65 97 67" stroke="#1D1D1F" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M99 67 Q101 65 103 67" stroke="#1D1D1F" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Smile */}
      <path d="M94 72 Q97 76 100 72" stroke="#E8604C" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Arms relaxed */}
      <path d="M88 90 Q75 95 72 90" stroke="#1D1D1F" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M95 88 Q108 93 112 88" stroke="#1D1D1F" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Legs */}
      <path d="M86 105 Q82 120 78 125" stroke="#1D1D1F" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M92 105 Q96 118 100 122" stroke="#1D1D1F" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Cloud / cushion under person */}
      <ellipse cx="88" cy="108" rx="22" ry="6" fill="#5B6CF0" opacity="0.12" />

      {/* Floating hearts / stars */}
      <path d="M120 60 L122 55 L124 60 L129 62 L124 64 L122 69 L120 64 L115 62Z" fill="#F5C542" opacity="0.6" />
      <circle cx="70" cy="55" r="2.5" fill="#E8604C" opacity="0.4" />
      <circle cx="130" cy="80" r="2" fill="#2DB67D" opacity="0.5" />

      {/* Check mark */}
      <circle cx="135" cy="55" r="12" fill="#2DB67D" opacity="0.15" />
      <path d="M130 55 L133 58 L140 51" stroke="#2DB67D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* Ground line — gentle */}
      <path d="M40 140 Q100 132 160 140" stroke="#E8E4DE" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  )
}

export function EmptyStateIllustration({ className = '' }) {
  return (
    <svg viewBox="0 0 200 180" fill="none" className={className}>
      {/* Balanced stones */}
      <ellipse cx="100" cy="145" rx="50" ry="6" fill="#F0EDE8" />

      {/* Bottom stone — largest */}
      <path d="M78 140 Q75 128 82 120 Q90 115 100 114 Q110 115 118 120 Q125 128 122 140Z" fill="#E8E4DE" stroke="#C5C0BA" strokeWidth="1" />

      {/* Middle stone */}
      <path d="M85 118 Q83 108 90 102 Q96 98 104 100 Q112 102 114 110 Q116 116 113 118Z" fill="#F0EDE8" stroke="#C5C0BA" strokeWidth="1" />

      {/* Top stone — smallest */}
      <ellipse cx="100" cy="94" rx="10" ry="8" fill="#FAF8F5" stroke="#C5C0BA" strokeWidth="1" />

      {/* Small plant growing from top */}
      <path d="M100 86 Q99 78 100 72" stroke="#2DB67D" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M100 78 Q94 72 92 68 Q96 72 100 78Z" fill="#2DB67D" opacity="0.6" />
      <path d="M100 74 Q106 68 109 65 Q105 70 100 74Z" fill="#2DB67D" opacity="0.5" />

      {/* Subtle dots */}
      <circle cx="60" cy="100" r="2" fill="#5B6CF0" opacity="0.15" />
      <circle cx="140" cy="90" r="2.5" fill="#E8604C" opacity="0.15" />
      <circle cx="70" cy="75" r="1.5" fill="#F5C542" opacity="0.2" />
    </svg>
  )
}

export function JoinTeamIllustration({ className = '' }) {
  return (
    <svg viewBox="0 0 240 180" fill="none" className={className}>
      {/* Connection arc */}
      <path d="M70 100 Q120 50 170 100" stroke="#5B6CF0" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.2" strokeDasharray="4 4" />

      {/* Person 1 — left */}
      <circle cx="70" cy="85" r="14" fill="#FFF0ED" stroke="#E8604C" strokeWidth="1.5" />
      <path d="M66 83 Q68 81 70 83" stroke="#1D1D1F" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M72 83 Q74 81 76 83" stroke="#1D1D1F" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M67 89 Q70 92 73 89" stroke="#E8604C" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      {/* Body */}
      <path d="M58 110 Q58 98 70 96 Q82 98 82 110" fill="#E8604C" opacity="0.15" stroke="#E8604C" strokeWidth="1" />

      {/* Person 2 — center */}
      <circle cx="120" cy="75" r="16" fill="#EDEFFD" stroke="#5B6CF0" strokeWidth="1.5" />
      <path d="M115 73 Q117 71 119 73" stroke="#1D1D1F" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M123 73 Q125 71 127 73" stroke="#1D1D1F" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M116 79 Q120 83 124 79" stroke="#5B6CF0" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M106 105 Q106 91 120 88 Q134 91 134 105" fill="#5B6CF0" opacity="0.1" stroke="#5B6CF0" strokeWidth="1" />

      {/* Person 3 — right */}
      <circle cx="170" cy="85" r="14" fill="#E2F5EC" stroke="#2DB67D" strokeWidth="1.5" />
      <path d="M166 83 Q168 81 170 83" stroke="#1D1D1F" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M172 83 Q174 81 176 83" stroke="#1D1D1F" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M167 89 Q170 92 173 89" stroke="#2DB67D" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M158 110 Q158 98 170 96 Q182 98 182 110" fill="#2DB67D" opacity="0.12" stroke="#2DB67D" strokeWidth="1" />

      {/* Connecting sparkles */}
      <circle cx="95" cy="78" r="2.5" fill="#F5C542" opacity="0.5" />
      <circle cx="145" cy="76" r="2" fill="#F5C542" opacity="0.4" />
      <circle cx="120" cy="60" r="3" fill="#F5C542" opacity="0.3" />

      {/* Ground */}
      <path d="M30 130 Q120 120 210 130" stroke="#E8E4DE" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  )
}

// Mood face illustrations — replace generic emojis with character
export function MoodFace({ mood, size = 48, className = '' }) {
  const colors = {
    great: { fill: '#E2F5EC', stroke: '#2DB67D', cheek: '#2DB67D' },
    good: { fill: '#E8EAFD', stroke: '#5B6CF0', cheek: '#5B6CF0' },
    okay: { fill: '#FDF5E0', stroke: '#D4A520', cheek: '#F5C542' },
    low: { fill: '#FDF0E4', stroke: '#E88C4A', cheek: '#E88C4A' },
    bad: { fill: '#FCEAEA', stroke: '#D94F4F', cheek: '#D94F4F' },
  }
  const c = colors[mood] || colors.okay

  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className}>
      <circle cx="24" cy="24" r="22" fill={c.fill} stroke={c.stroke} strokeWidth="1.5" />

      {mood === 'great' && (
        <>
          {/* Closed happy eyes */}
          <path d="M15 22 Q18 18 21 22" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M27 22 Q30 18 33 22" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" fill="none" />
          {/* Wide smile */}
          <path d="M16 28 Q24 36 32 28" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" fill="none" />
          {/* Rosy cheeks */}
          <circle cx="13" cy="27" r="3" fill={c.cheek} opacity="0.2" />
          <circle cx="35" cy="27" r="3" fill={c.cheek} opacity="0.2" />
        </>
      )}

      {mood === 'good' && (
        <>
          {/* Soft eyes */}
          <circle cx="18" cy="21" r="2.5" fill={c.stroke} />
          <circle cx="30" cy="21" r="2.5" fill={c.stroke} />
          <circle cx="19" cy="20" r="0.8" fill="white" />
          <circle cx="31" cy="20" r="0.8" fill="white" />
          {/* Gentle smile */}
          <path d="M18 29 Q24 34 30 29" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" fill="none" />
        </>
      )}

      {mood === 'okay' && (
        <>
          {/* Neutral eyes */}
          <circle cx="18" cy="22" r="2" fill={c.stroke} />
          <circle cx="30" cy="22" r="2" fill={c.stroke} />
          {/* Flat mouth */}
          <line x1="19" y1="30" x2="29" y2="30" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" />
        </>
      )}

      {mood === 'low' && (
        <>
          {/* Slightly sad eyes */}
          <circle cx="18" cy="22" r="2" fill={c.stroke} />
          <circle cx="30" cy="22" r="2" fill={c.stroke} />
          {/* Eyebrows slightly worried */}
          <line x1="14" y1="17" x2="20" y2="18" stroke={c.stroke} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="28" y1="18" x2="34" y2="17" stroke={c.stroke} strokeWidth="1.5" strokeLinecap="round" />
          {/* Slight frown */}
          <path d="M19 31 Q24 28 29 31" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" fill="none" />
        </>
      )}

      {mood === 'bad' && (
        <>
          {/* Sad eyes */}
          <circle cx="18" cy="22" r="2" fill={c.stroke} />
          <circle cx="30" cy="22" r="2" fill={c.stroke} />
          {/* Worried brows */}
          <line x1="13" y1="16" x2="21" y2="18" stroke={c.stroke} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="27" y1="18" x2="35" y2="16" stroke={c.stroke} strokeWidth="1.5" strokeLinecap="round" />
          {/* Frown */}
          <path d="M18 33 Q24 28 30 33" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" fill="none" />
          {/* Tear drop */}
          <path d="M32 24 Q33 27 32 28 Q31 27 32 24Z" fill={c.stroke} opacity="0.4" />
        </>
      )}
    </svg>
  )
}
