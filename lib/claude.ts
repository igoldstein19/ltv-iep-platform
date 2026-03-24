import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export { anthropic }

export interface ExtractedIEPData {
  disabilityCategory: string
  goals: Array<{
    area: string
    description: string
    baseline: string
    target: string
    measurementType: string
  }>
}

export async function extractIEPFromText(
  pdfText: string,
  studentName: string
): Promise<ExtractedIEPData> {
  const message = await anthropic.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: `You are a special education expert. Extract the IEP information from the following text for student: ${studentName}.

Return ONLY a valid JSON object (no markdown, no explanation) with this exact structure:
{
  "disabilityCategory": "string describing the disability category",
  "goals": [
    {
      "area": "one of: Reading, Writing, Math, Communication, Behavior, Social Skills, Motor Skills, Life Skills, Other",
      "description": "full goal description",
      "baseline": "current performance baseline",
      "target": "target/mastery criteria",
      "measurementType": "one of: percentage, frequency, duration, level"
    }
  ]
}

IEP Text:
${pdfText.substring(0, 8000)}`,
      },
    ],
  })

  const content = message.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude')
  }

  try {
    // Try to extract JSON from the response
    const text = content.text.trim()
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in response')
    }
    return JSON.parse(jsonMatch[0]) as ExtractedIEPData
  } catch {
    throw new Error('Failed to parse IEP extraction response')
  }
}

export interface ReportData {
  studentName: string
  grade: string
  disabilityCategory: string
  iepStartDate: string
  iepEndDate: string
  reportingPeriod: string
  teacherName: string
  goals: Array<{
    area: string
    description: string
    baseline: string
    target: string
    measurementType: string
    recentScore: number
    trend: string
    entries: Array<{
      date: string
      score: number
      notes: string
      promptLevel: string
    }>
  }>
}

export interface GeneratedReport {
  summary: string
  goalNarratives: Array<{
    area: string
    narrative: string
    currentScore: number
    trend: string
  }>
  generatedAt: string
}

export async function generateProgressReport(
  data: ReportData
): Promise<GeneratedReport> {
  const goalsText = data.goals
    .map((goal) => {
      const recentEntries = goal.entries.slice(-5)
      const scores = recentEntries.map((e) => e.score).join(', ')
      return `
Goal Area: ${goal.area}
Description: ${goal.description}
Baseline: ${goal.baseline}
Target: ${goal.target}
Recent Scores (last 5): ${scores}%
Trend: ${goal.trend}
Recent Notes: ${recentEntries
        .map((e) => `${e.date}: ${e.notes || 'No notes'} (Prompt level: ${e.promptLevel || 'not recorded'})`)
        .join(' | ')}`
    })
    .join('\n\n')

  const prompt = `You are an experienced special education teacher writing a quarterly progress report. Based on the following student data, write a professional, parent-friendly progress report.

Student: ${data.studentName}
Grade: ${data.grade}
Disability Category: ${data.disabilityCategory}
Reporting Period: ${data.reportingPeriod}
Teacher: ${data.teacherName}

IEP Goals and Progress Data:
${goalsText}

Instructions:
- For each goal, write 2-3 sentences describing the student's progress, current performance level, and what you're working on next
- End with a 2-3 sentence overall summary
- Be warm, specific, and professional
- Use the student's first name throughout
- Focus on growth and strengths while being honest about areas needing continued support
- Write as if speaking directly to parents

Return ONLY a valid JSON object (no markdown) with this structure:
{
  "summary": "2-3 sentence overall summary paragraph",
  "goalNarratives": [
    {
      "area": "goal area name",
      "narrative": "2-3 sentence narrative about this goal",
      "currentScore": numeric_current_score,
      "trend": "improving/stable/declining"
    }
  ]
}`

  const message = await anthropic.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 3000,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  })

  const content = message.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude')
  }

  try {
    const text = content.text.trim()
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in response')
    }
    const parsed = JSON.parse(jsonMatch[0])
    return {
      ...parsed,
      generatedAt: new Date().toISOString(),
    }
  } catch {
    throw new Error('Failed to parse report generation response')
  }
}
