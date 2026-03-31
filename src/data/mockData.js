export const moodConfig = {
  great: { emoji: '😄', label: 'Great',   color: '#34C759', bg: '#E4F4E5', bgLight: '#F2FAF2' },
  good:  { emoji: '😊', label: 'Good',    color: '#007AFF', bg: '#E3F1FD', bgLight: '#F0F8FF' },
  okay:  { emoji: '😐', label: 'Okay',    color: '#FFCC00', bg: '#FFF9E0', bgLight: '#FFFEF5' },
  low:   { emoji: '😔', label: 'Low',     color: '#FF9500', bg: '#FFF1E0', bgLight: '#FFF8F0' },
  bad:   { emoji: '😢', label: 'Bad',     color: '#FF3B30', bg: '#FDECEC', bgLight: '#FFF5F5' },
}

export const checkInQuestions = [
  {
    id: 'mood',
    question: 'How are you feeling right now?',
    subtitle: 'Be honest — this is just for you.',
    type: 'mood-select',
  },
  {
    id: 'energy',
    question: 'What\'s your energy level?',
    subtitle: 'From completely drained to fully charged.',
    type: 'slider',
    min: 1,
    max: 10,
    lowLabel: 'Exhausted',
    highLabel: 'Energized',
    lowEmoji: '🪫',
    highEmoji: '⚡',
  },
  {
    id: 'stress',
    question: 'How stressed do you feel?',
    subtitle: 'It\'s okay to acknowledge it.',
    type: 'slider',
    min: 1,
    max: 10,
    lowLabel: 'Calm',
    highLabel: 'Very stressed',
    lowEmoji: '🧘',
    highEmoji: '🔥',
  },
  {
    id: 'mentalLoad',
    question: 'How heavy is your mental load?',
    subtitle: 'Tasks, worries, things on your mind.',
    type: 'slider',
    min: 1,
    max: 10,
    lowLabel: 'Light',
    highLabel: 'Overwhelming',
    lowEmoji: '🪶',
    highEmoji: '🧠',
  },
  {
    id: 'sleep',
    question: 'Did you sleep well last night?',
    subtitle: 'Sleep quality impacts everything.',
    type: 'yes-no',
  },
  {
    id: 'note',
    question: 'Anything else on your mind?',
    subtitle: 'Totally optional. Only visible to you.',
    type: 'text',
  },
]

// Generate deterministic mood history
export function generateMoodHistory(seed) {
  const history = []
  const today = new Date()

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dayVal = (seed * 7 + i * 13 + date.getDay() * 3) % 100
    let mood
    if (dayVal < 25) mood = 'great'
    else if (dayVal < 50) mood = 'good'
    else if (dayVal < 70) mood = 'okay'
    else if (dayVal < 88) mood = 'low'
    else mood = 'bad'

    if (date.getDay() === 0 || (date.getDay() === 6 && dayVal > 60)) continue

    history.push({
      date: date.toISOString().split('T')[0],
      mood,
      energy: Math.max(1, Math.min(10, Math.floor(dayVal / 10) + 1)),
      stress: Math.max(1, Math.min(10, 10 - Math.floor(dayVal / 12))),
      mentalLoad: Math.max(1, Math.min(10, Math.floor((100 - dayVal) / 11) + 1)),
      sleep: dayVal > 40 ? 'yes' : 'no',
      timestamp: date.toISOString(),
    })
  }
  return history
}

export const demoEmployees = [
  { id: 'emp1', name: 'Sophie Martin',    role: 'Product Designer',     avatar: 'SM', seed: 1 },
  { id: 'emp2', name: 'Thomas Dubois',    role: 'Frontend Developer',   avatar: 'TD', seed: 2 },
  { id: 'emp3', name: 'Marie Lefebvre',   role: 'Project Manager',      avatar: 'ML', seed: 3 },
  { id: 'emp4', name: 'Lucas Bernard',    role: 'Backend Developer',    avatar: 'LB', seed: 4 },
  { id: 'emp5', name: 'Emma Petit',       role: 'UX Researcher',        avatar: 'EP', seed: 5 },
  { id: 'emp6', name: 'Hugo Moreau',      role: 'Data Analyst',         avatar: 'HM', seed: 6 },
  { id: 'emp7', name: 'Camille Roux',     role: 'QA Engineer',          avatar: 'CR', seed: 7 },
  { id: 'emp8', name: 'Antoine Laurent',  role: 'DevOps Engineer',      avatar: 'AL', seed: 8 },
]
