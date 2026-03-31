import { useState, useEffect } from 'react'
import { moodConfig } from '../data/mockData'

/**
 * Hook to get AI insights about the team.
 * In a real production app, this would call a backend function (like Firebase Functions)
 * that uses the AWS Bedrock logic from the 'agent to add' folder.
 * 
 * For this hackathon demo, we simulate the logic client-side or call a proxy.
 */
export function useAIAgent(checkins, members) {
  const [insight, setInsight] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!checkins || checkins.length === 0) return

    const generateInsight = async () => {
      setLoading(true)
      try {
        // Logic adapted from agent to add/backend/src/lib/agent.ts
        const today = new Date().toISOString().split('T')[0]
        const recentCheckins = checkins.filter(c => {
          const d = new Date(c.date)
          const weekAgo = new Date()
          weekAgo.setDate(weekAgo.getDate() - 7)
          return d >= weekAgo
        })

        if (recentCheckins.length === 0) {
          setInsight("No check-in data available for the last 7 days to generate an insight.")
          setLoading(false)
          return
        }

        // Aggregate per user (anonymized)
        const byUser = {}
        recentCheckins.forEach(e => {
          if (!byUser[e.userId]) byUser[e.userId] = { mood: [], energy: [], stress: [], mentalLoad: [] }
          // Map mood string to value for averaging if needed
          const moodValue = e.mood === 'great' ? 10 : e.mood === 'good' ? 8 : e.mood === 'okay' ? 5 : e.mood === 'low' ? 3 : 1
          byUser[e.userId].mood.push(moodValue)
          byUser[e.userId].energy.push(e.energy || 5)
          byUser[e.userId].stress.push(e.stress || 5)
          byUser[e.userId].mentalLoad.push(e.mentalLoad || 5)
        })

        const avg = (arr) => (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1)

        const summary = Object.entries(byUser)
          .map(([uid, v]) =>
            `User: mood=${avg(v.mood)}, energy=${avg(v.energy)}, stress=${avg(v.stress)}, mentalLoad=${avg(v.mentalLoad)}`
          )
          .join("\n")

        // For the sake of the demo, we use a slightly more advanced mock 
        // that reflects the actual team data, but ideally this is where 
        // you'd call your API that runs the Bedrock agent.
        
        // Let's simulate a delay for the "AI thinking" vibe
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Heuristic-based recap (fallback if no real API)
        const totalStress = recentCheckins.reduce((s, c) => s + (c.stress || 0), 0) / recentCheckins.length
        const totalEnergy = recentCheckins.length > 0 ? (recentCheckins.reduce((s, c) => s + (c.energy || 0), 0) / recentCheckins.length) : 0
        
        let generatedInsight = ""
        if (totalStress > 6) {
          generatedInsight = "The team's stress levels have been elevated this week. Consider reviewing upcoming deadlines and ensuring everyone has sufficient breaks. A group synchronization or a 'no-meetings' afternoon might help lower the collective mental load."
        } else if (totalEnergy < 4) {
          generatedInsight = "Team vitality appears low. There are signs of fatigue across multiple members. It might be a good time to celebrate small wins or suggest some light-hearted team activity to boost morale."
        } else {
          generatedInsight = "The team is showing a healthy balance of energy and manageable stress. Mental load is distributed well. Maintaining the current pace and continuing regular check-ins will help sustain this positive momentum."
        }

        setInsight(generatedInsight)
      } catch (err) {
        console.error("AI Agent error:", err)
        setError("AI insight unavailable.")
      } finally {
        setLoading(false)
      }
    }

    generateInsight()
  }, [checkins])

  return { insight, loading, error }
}
