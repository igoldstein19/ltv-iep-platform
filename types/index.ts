export interface Teacher {
  id: string
  email: string
  name: string
  school?: string | null
  gradeRange?: string | null
  createdAt: Date
}

export interface Student {
  id: string
  name: string
  grade: string
  dateOfBirth?: Date | null
  disabilityCategory?: string | null
  iepStartDate?: Date | null
  iepEndDate?: Date | null
  teacherId: string
  goals?: Goal[]
  progressEntries?: ProgressEntry[]
  reports?: Report[]
  createdAt: Date
}

export interface Goal {
  id: string
  studentId: string
  area: string
  description: string
  baseline?: string | null
  target?: string | null
  measurementType?: string | null
  progressEntries?: ProgressEntry[]
  createdAt: Date
}

export interface ProgressEntry {
  id: string
  studentId: string
  goalId: string
  date: Date
  score?: number | null
  notes?: string | null
  promptLevel?: string | null
  teacherId: string
  createdAt: Date
  goal?: Goal
}

export interface Report {
  id: string
  studentId: string
  reportingPeriod: string
  content: string
  generatedAt: Date
  teacherId: string
}

export interface StudentWithDetails extends Student {
  goals: GoalWithEntries[]
  progressEntries: ProgressEntry[]
}

export interface GoalWithEntries extends Goal {
  progressEntries: ProgressEntry[]
}

export interface StudentStatus {
  status: 'on-track' | 'needs-attention' | 'at-risk' | 'no-data'
  averageScore: number | null
}

export interface DashboardStats {
  totalStudents: number
  onTrack: number
  needsAttention: number
  atRisk: number
  reportsDue: number
}

export interface ReportContent {
  summary: string
  goalNarratives: Array<{
    area: string
    narrative: string
    currentScore: number
    trend: string
  }>
  generatedAt: string
}

export interface ExtractedGoal {
  area: string
  description: string
  baseline: string
  target: string
  measurementType: string
}

export interface IEPExtractionResult {
  disabilityCategory: string
  goals: ExtractedGoal[]
}

export const GOAL_AREAS = [
  'Reading',
  'Writing',
  'Math',
  'Communication',
  'Behavior',
  'Social Skills',
  'Motor Skills',
  'Life Skills',
  'Other',
] as const

export const PROMPT_LEVELS = [
  { value: 'independent', label: 'Independent' },
  { value: 'verbal', label: 'Verbal Prompt' },
  { value: 'gestural', label: 'Gestural Prompt' },
  { value: 'physical', label: 'Physical Prompt' },
  { value: 'full', label: 'Full Assistance' },
] as const

export const MEASUREMENT_TYPES = [
  { value: 'percentage', label: 'Percentage (%)' },
  { value: 'frequency', label: 'Frequency (count)' },
  { value: 'duration', label: 'Duration (minutes)' },
  { value: 'level', label: 'Performance Level' },
] as const

export const DISABILITY_CATEGORIES = [
  'Autism Spectrum Disorder',
  'ADHD',
  'Learning Disability',
  'Intellectual Disability',
  'Emotional/Behavioral Disorder',
  'Speech/Language Impairment',
  'Hearing Impairment',
  'Visual Impairment',
  'Physical/Motor Impairment',
  'Traumatic Brain Injury',
  'Developmental Delay',
  'Other Health Impairment',
  'Multiple Disabilities',
  'Other',
] as const

export const GRADE_OPTIONS = [
  'Kindergarten', '1st', '2nd', '3rd', '4th', '5th',
  '6th', '7th', '8th', '9th', '10th', '11th', '12th',
] as const
