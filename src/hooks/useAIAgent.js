import { useState, useEffect } from 'react'

/**
 * Hook that calls the real AI backend to generate team insights.
 * The server proxies to the Anthropic API with RAG-enhanced prompts.
 */
export function useAIAgent(checkins, members) {
  const [insight, setInsight] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!checkins || checkins.length === 0) return

    const controller = new AbortController()

    const generateInsight = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/insights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ checkins, members }),
          signal: controller.signal,
        })

        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body.error || `Server error (${res.status})`)
        }

        const data = await res.json()
        setInsight(data.insight)
      } catch (err) {
        if (err.name === 'AbortError') return
        console.error('AI Agent error:', err)
        setError(err.message || 'AI insight unavailable.')
      } finally {
        setLoading(false)
      }
    }

    generateInsight()

    return () => controller.abort()
  }, [checkins])

  return { insight, loading, error }
}
