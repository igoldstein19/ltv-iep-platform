import { format, formatDistanceToNow } from 'date-fns'

// Simple className utility without clsx dependency
export function cn(...inputs: (string | undefined | null | boolean | Record<string, boolean>)[]): string {
  return inputs
    .filter(Boolean)
    .map((input) => {
      if (typeof input === 'string') return input
      if (typeof input === 'object' && input !== null) {
        return Object.entries(input)
          .filter(([, value]) => value)
          .map(([key]) => key)
          .join(' ')
      }
      return ''
    })
    .join(' ')
}

export type StudentStatus = 'on-track' | 'needs-attention' | 'at-risk' | 'no-data'

export function calculateStudentStatus(scores: number[]): StudentStatus {
  if (!scores || scores.length === 0) return 'no-data'

  const recentScores = scores.slice(-5)
  const avg = recentScores.reduce((a, b) => a + b, 0) / recentScores.length

  if (avg >= 70) return 'on-track'
  if (avg >= 50) return 'needs-attention'
  return 'at-risk'
}

export function getStatusLabel(status: StudentStatus): string {
  switch (status) {
    case 'on-track': return 'On Track'
    case 'needs-attention': return 'Needs Attention'
    case 'at-risk': return 'At Risk'
    case 'no-data': return 'No Data'
  }
}

export function getStatusColors(status: StudentStatus): {
  bg: string
  text: string
  dot: string
} {
  switch (status) {
    case 'on-track':
      return { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' }
    case 'needs-attention':
      return { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' }
    case 'at-risk':
      return { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' }
    case 'no-data':
      return { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' }
  }
}

export function getGoalAreaColor(area: string): string {
  const colors: Record<string, string> = {
    'Reading': 'bg-blue-100 text-blue-700',
    'Writing': 'bg-purple-100 text-purple-700',
    'Math': 'bg-indigo-100 text-indigo-700',
    'Communication': 'bg-green-100 text-green-700',
    'Behavior': 'bg-orange-100 text-orange-700',
    'Social Skills': 'bg-pink-100 text-pink-700',
    'Motor Skills': 'bg-cyan-100 text-cyan-700',
    'Life Skills': 'bg-teal-100 text-teal-700',
    'Other': 'bg-slate-100 text-slate-700',
  }
  return colors[area] || colors['Other']
}

export function getGoalAreaBgColor(area: string): string {
  const colors: Record<string, string> = {
    'Reading': '#3B82F6',
    'Writing': '#8B5CF6',
    'Math': '#6366F1',
    'Communication': '#10B981',
    'Behavior': '#F97316',
    'Social Skills': '#EC4899',
    'Motor Skills': '#06B6D4',
    'Life Skills': '#14B8A6',
    'Other': '#64748B',
  }
  return colors[area] || colors['Other']
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return 'N/A'
  try {
    return format(new Date(date), 'MMM d, yyyy')
  } catch {
    return 'N/A'
  }
}

export function formatDateShort(date: Date | string | null | undefined): string {
  if (!date) return 'N/A'
  try {
    return format(new Date(date), 'MM/dd/yy')
  } catch {
    return 'N/A'
  }
}

export function formatRelativeTime(date: Date | string): string {
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true })
  } catch {
    return 'unknown'
  }
}

export function getGreeting(name: string): string {
  const hour = new Date().getHours()
  let greeting = 'Good morning'
  if (hour >= 12 && hour < 17) greeting = 'Good afternoon'
  if (hour >= 17) greeting = 'Good evening'
  const firstName = name.split(' ')[0]
  return `${greeting}, ${firstName}!`
}

export function calculateTrend(scores: number[]): 'improving' | 'stable' | 'declining' {
  if (scores.length < 3) return 'stable'
  const recent = scores.slice(-3)
  const earlier = scores.slice(-6, -3)
  if (earlier.length === 0) return 'stable'

  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length
  const earlierAvg = earlier.reduce((a, b) => a + b, 0) / earlier.length

  const diff = recentAvg - earlierAvg
  if (diff > 5) return 'improving'
  if (diff < -5) return 'declining'
  return 'stable'
}

export function getPromptLevelLabel(level: string | null | undefined): string {
  const labels: Record<string, string> = {
    'independent': 'Independent',
    'verbal': 'Verbal Prompt',
    'gestural': 'Gestural Prompt',
    'physical': 'Physical Prompt',
    'full': 'Full Assistance',
  }
  return level ? (labels[level] || level) : 'N/A'
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

export function getAvatarColor(name: string): string {
  const colors = [
    'bg-indigo-500',
    'bg-purple-500',
    'bg-blue-500',
    'bg-emerald-500',
    'bg-amber-500',
    'bg-pink-500',
    'bg-cyan-500',
    'bg-orange-500',
  ]
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}
