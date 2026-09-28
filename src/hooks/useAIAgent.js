import { useState, useEffect } from 'react'

/**
 * Hook that returns a fake AI insight for demo purposes.
 */
export function useAIAgent(checkins, members) {
  const [insight, setInsight] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Simulate a short loading delay then return fake insight
    const timer = setTimeout(() => {
      setInsight(
        `📊 **Weekly Team Pulse Summary**\n\n` +
        `Overall team wellness is **trending positively** this week. Average energy levels are at 6.8/10, up from 5.9 last week. ` +
        `Stress indicators have decreased by 12% across the team, which correlates with the completion of the Q1 sprint cycle.\n\n` +
        `⚠️ **Watch area:** Two team members reported elevated mental load (8+/10) for three consecutive days. ` +
        `Research suggests sustained cognitive overload beyond 72 hours significantly impacts decision quality (Zaki et al., 2009). ` +
        `Consider a brief 1:1 check-in to explore workload redistribution.\n\n` +
        `💡 **Recommendation:** The team's mood distribution skews positive (62% "Good" or "Great"), but Friday check-ins consistently show lower energy. ` +
        `A lighter meeting schedule on Fridays could help sustain end-of-week momentum.`
      )
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [checkins, members])

  return { insight, loading, error }
}
