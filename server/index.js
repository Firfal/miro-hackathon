import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'

const app = express()
app.use(cors())
app.use(express.json())

const bedrock = new BedrockRuntimeClient({ region: process.env.AWS_REGION || 'us-west-2' })
const MODEL_ID = process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-haiku-20240307-v1:0'

// --- RAG Knowledge Base (from agent to add/backend/src/lib/ragDocs.ts) ---

const RAG_DOCUMENTS = [
  {
    title: "The neural bases of empathic accuracy (Zaki et al., 2009)",
    content: `Empathic accuracy (EA) is defined as the match between a perceiver's judgment of what a target was feeling and the report that target provided of what they were actually feeling.

Key finding: Empathically accurate judgments depended on (i) structures within the human mirror neuron system thought to be involved in shared sensorimotor representations, and (ii) regions implicated in mental state attribution.

Practical implication: Accurate understanding of others' emotional states is not purely intuitive — it requires both shared emotional resonance AND explicit cognitive inference. Managers who only rely on gut feeling may systematically misread their team's emotional state.

The gap between perception and reality: Perceivers were only moderately accurate at inferring target affect (mean r = 0.46), meaning even well-intentioned observers miss nearly half of what others are actually feeling. This supports the need for structured, regular check-in tools rather than relying on informal observation.`,
  },
  {
    title: "Research Methods for Personal Relationships (Rehmatullah & Ickes)",
    content: `The trade-off problem in measuring team wellbeing: Self-report methods (like daily check-ins) are the most efficient way to access subjective states, but retrospective reports can be biased. Behavior-proximal reporting — asking people how they feel close to the moment — minimizes distortion. This is why daily check-ins are more reliable than weekly or monthly surveys.

Memory bias in retrospective reports: McFarland and Ross (1987) found that participants who became more negative about themselves recalled their past ratings as being more negative. Daily check-ins avoid this by capturing state at the moment.

Diary method: Frequent, positive micro-interactions predict team health. Mindly's check-in is a structured interaction record applied to the workplace.

Individual vs team-level analysis: Individual scores matter, but the pattern across the team — who is struggling while others thrive — reveals systemic issues that individual data alone cannot.`,
  },
  {
    title: "Mindly Score Interpretation Guide",
    content: `Score scale: Mood is categorical (great/good/okay/low/bad). Energy, stress, and mental load are rated 1–10.

Wellbeing indicators:
- Stress >= 7: elevated, burnout risk if sustained
- Energy <= 3: low vitality, possible disengagement
- Mental load >= 7: cognitive overload
- Mood "low" or "bad" for 3+ days: sustained negative affect

Team-level signals:
- If >30% of team scores show high stress: systemic issue (workload, culture)
- If one subgroup consistently scores lower: possible team dynamic issue
- If scores drop every Thursday/Friday: end-of-week overload

What managers should NOT do:
- Do not share individual scores with the team
- Do not use scores in performance reviews
- Do not assume low scores mean poor performance — they indicate need for support

Recommended: Combine quantitative check-in data with qualitative 1:1 conversations.`,
  },
]

// --- Insight endpoint ---

app.post('/api/insights', async (req, res) => {
  try {
    const { checkins, members } = req.body

    if (!checkins || checkins.length === 0) {
      return res.json({ insight: "No check-in data available yet to generate an insight." })
    }

    // Filter to last 7 days
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const recentCheckins = checkins.filter(c => {
      const d = new Date(c.date)
      return d >= weekAgo
    })

    if (recentCheckins.length === 0) {
      return res.json({ insight: "No check-in data available for the last 7 days." })
    }

    // Aggregate per user (anonymized)
    const byUser = {}
    for (const e of recentCheckins) {
      if (!byUser[e.userId]) byUser[e.userId] = { mood: [], energy: [], stress: [], mentalLoad: [] }
      const moodValue = e.mood === 'great' ? 5 : e.mood === 'good' ? 4 : e.mood === 'okay' ? 3 : e.mood === 'low' ? 2 : 1
      byUser[e.userId].mood.push(moodValue)
      byUser[e.userId].energy.push(e.energy || 5)
      byUser[e.userId].stress.push(e.stress || 5)
      byUser[e.userId].mentalLoad.push(e.mentalLoad || 5)
    }

    const avg = (arr) => (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1)

    const summary = Object.entries(byUser)
      .map(([uid, v], i) =>
        `Team member ${i + 1}: mood=${avg(v.mood)}/5, energy=${avg(v.energy)}/10, stress=${avg(v.stress)}/10, mentalLoad=${avg(v.mentalLoad)}/10`
      )
      .join("\n")

    const ragContext = RAG_DOCUMENTS.map(d => `## ${d.title}\n\n${d.content}`).join("\n\n---\n\n")

    const systemPrompt = `You are Mindly's AI wellbeing analyst — a knowledgeable, empathetic, and evidence-based assistant for workplace mental health.

You have access to the following scientific knowledge base:

---

${ragContext}

---

Guidelines:
- Ground your advice in the research above when relevant
- Be warm, direct, and practical
- Never suggest diagnosing employees
- Focus on actionable team-level patterns, not individuals
- Keep responses concise (3-4 sentences)`

    const userPrompt = `Based on the following anonymized team check-in averages from the past week, provide a concise actionable insight for the HR manager. Focus on identifying at-risk patterns and concrete recommendations. Do not mention specific member numbers.

Team size: ${members?.length || Object.keys(byUser).length} members
Check-ins this week: ${recentCheckins.length}

Data:
${summary}

Insight:`

    const response = await bedrock.send(
      new InvokeModelCommand({
        modelId: MODEL_ID,
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify({
          anthropic_version: 'bedrock-2023-05-31',
          max_tokens: 300,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }],
        }),
      })
    )

    const body = JSON.parse(new TextDecoder().decode(response.body))
    const insight = body.content?.[0]?.text || 'Unable to generate insight.'
    res.json({ insight })
  } catch (err) {
    console.error('Bedrock error:', err.message)
    res.status(500).json({ error: 'AI insight generation failed: ' + err.message })
  }
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', model: MODEL_ID, region: process.env.AWS_REGION })
})

const PORT = process.env.API_PORT || 3001
app.listen(PORT, () => {
  console.log(`Mindly API server running on http://localhost:${PORT}`)
  console.log(`Bedrock model: ${MODEL_ID} (${process.env.AWS_REGION})`)
})
