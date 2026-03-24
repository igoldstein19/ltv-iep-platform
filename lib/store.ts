// In-memory store — replaces Prisma/SQLite for the no-DB MVP deployment.
// Data resets on each serverless cold start; good enough for demos.

export interface ProgressEntry {
  id: string
  studentId: string
  goalId: string
  date: string
  score: number | null
  notes: string | null
  promptLevel: string | null
  teacherId: string
  goal?: Goal
}

export interface Goal {
  id: string
  studentId: string
  area: string
  description: string
  baseline: string | null
  target: string | null
  measurementType: string | null
  createdAt: string
  progressEntries: ProgressEntry[]
}

export interface Student {
  id: string
  teacherId: string
  name: string
  grade: string
  dateOfBirth: string | null
  disabilityCategory: string | null
  iepStartDate: string | null
  iepEndDate: string | null
  createdAt: string
  goals: Goal[]
  progressEntries: ProgressEntry[]
  reports: Report[]
}

export interface Report {
  id: string
  studentId: string
  teacherId: string
  reportingPeriod: string
  content: string
  generatedAt: string
}

// ── Seed data ──────────────────────────────────────────────────────────────

const seedStudents: Student[] = [
  // Teacher 1 — Sarah Johnson
  {
    id: 'student-1',
    teacherId: 'teacher-1',
    name: 'Alex Rivera',
    grade: '4th Grade',
    dateOfBirth: '2015-03-12',
    disabilityCategory: 'Specific Learning Disability',
    iepStartDate: '2025-09-01',
    iepEndDate: '2026-08-31',
    createdAt: '2025-09-01T00:00:00Z',
    reports: [],
    goals: [
      {
        id: 'goal-1-1',
        studentId: 'student-1',
        area: 'Reading',
        description: 'Alex will read a 3rd grade passage and answer comprehension questions with 80% accuracy across 4 out of 5 trials.',
        baseline: '45%',
        target: '80%',
        measurementType: 'percentage',
        createdAt: '2025-09-01T00:00:00Z',
        progressEntries: [
          { id: 'pe-1', studentId: 'student-1', goalId: 'goal-1-1', date: '2025-09-15', score: 48, notes: 'Needed significant prompting', promptLevel: 'maximum', teacherId: 'teacher-1' },
          { id: 'pe-2', studentId: 'student-1', goalId: 'goal-1-1', date: '2025-10-01', score: 52, notes: 'Improved on main idea questions', promptLevel: 'moderate', teacherId: 'teacher-1' },
          { id: 'pe-3', studentId: 'student-1', goalId: 'goal-1-1', date: '2025-10-15', score: 58, notes: 'Good focus today', promptLevel: 'moderate', teacherId: 'teacher-1' },
          { id: 'pe-4', studentId: 'student-1', goalId: 'goal-1-1', date: '2025-11-01', score: 62, notes: 'Answered inference questions independently', promptLevel: 'minimal', teacherId: 'teacher-1' },
          { id: 'pe-5', studentId: 'student-1', goalId: 'goal-1-1', date: '2025-11-15', score: 65, notes: 'Strong performance on narrative text', promptLevel: 'minimal', teacherId: 'teacher-1' },
          { id: 'pe-6', studentId: 'student-1', goalId: 'goal-1-1', date: '2025-12-01', score: 70, notes: 'Consistent improvement', promptLevel: 'minimal', teacherId: 'teacher-1' },
        ],
      },
      {
        id: 'goal-1-2',
        studentId: 'student-1',
        area: 'Writing',
        description: 'Alex will write a 5-sentence paragraph with a topic sentence, 3 supporting details, and a concluding sentence with 75% accuracy.',
        baseline: '30%',
        target: '75%',
        measurementType: 'percentage',
        createdAt: '2025-09-01T00:00:00Z',
        progressEntries: [
          { id: 'pe-7', studentId: 'student-1', goalId: 'goal-1-2', date: '2025-09-15', score: 35, notes: 'Struggles with concluding sentence', promptLevel: 'maximum', teacherId: 'teacher-1' },
          { id: 'pe-8', studentId: 'student-1', goalId: 'goal-1-2', date: '2025-10-15', score: 45, notes: 'Topic sentences improving', promptLevel: 'moderate', teacherId: 'teacher-1' },
          { id: 'pe-9', studentId: 'student-1', goalId: 'goal-1-2', date: '2025-11-15', score: 55, notes: 'Used graphic organizer independently', promptLevel: 'minimal', teacherId: 'teacher-1' },
          { id: 'pe-10', studentId: 'student-1', goalId: 'goal-1-2', date: '2025-12-01', score: 60, notes: 'Good progress on structure', promptLevel: 'minimal', teacherId: 'teacher-1' },
        ],
      },
    ],
    progressEntries: [],
  },
  {
    id: 'student-2',
    teacherId: 'teacher-1',
    name: 'Jordan Kim',
    grade: '3rd Grade',
    dateOfBirth: '2016-07-22',
    disabilityCategory: 'Autism Spectrum Disorder',
    iepStartDate: '2025-09-01',
    iepEndDate: '2026-08-31',
    createdAt: '2025-09-01T00:00:00Z',
    reports: [],
    goals: [
      {
        id: 'goal-2-1',
        studentId: 'student-2',
        area: 'Math',
        description: 'Jordan will solve two-step word problems involving addition and subtraction within 100 with 70% accuracy across 3 consecutive sessions.',
        baseline: '25%',
        target: '70%',
        measurementType: 'percentage',
        createdAt: '2025-09-01T00:00:00Z',
        progressEntries: [
          { id: 'pe-11', studentId: 'student-2', goalId: 'goal-2-1', date: '2025-09-15', score: 28, notes: 'Difficulty identifying operation needed', promptLevel: 'maximum', teacherId: 'teacher-1' },
          { id: 'pe-12', studentId: 'student-2', goalId: 'goal-2-1', date: '2025-10-01', score: 35, notes: 'Better with visual supports', promptLevel: 'moderate', teacherId: 'teacher-1' },
          { id: 'pe-13', studentId: 'student-2', goalId: 'goal-2-1', date: '2025-10-15', score: 42, notes: 'Using number line effectively', promptLevel: 'moderate', teacherId: 'teacher-1' },
          { id: 'pe-14', studentId: 'student-2', goalId: 'goal-2-1', date: '2025-11-01', score: 50, notes: 'Solved 5/10 independently', promptLevel: 'minimal', teacherId: 'teacher-1' },
          { id: 'pe-15', studentId: 'student-2', goalId: 'goal-2-1', date: '2025-11-15', score: 55, notes: 'Good day, stayed focused', promptLevel: 'minimal', teacherId: 'teacher-1' },
        ],
      },
      {
        id: 'goal-2-2',
        studentId: 'student-2',
        area: 'Social/Emotional',
        description: 'Jordan will use a self-regulation strategy (deep breathing, break card) when frustrated in 4 out of 5 observed opportunities.',
        baseline: '1 out of 5',
        target: '4 out of 5',
        measurementType: 'frequency',
        createdAt: '2025-09-01T00:00:00Z',
        progressEntries: [
          { id: 'pe-16', studentId: 'student-2', goalId: 'goal-2-2', date: '2025-09-15', score: 20, notes: 'Used break card once', promptLevel: 'maximum', teacherId: 'teacher-1' },
          { id: 'pe-17', studentId: 'student-2', goalId: 'goal-2-2', date: '2025-10-15', score: 40, notes: 'Used breathing twice, needed reminders', promptLevel: 'moderate', teacherId: 'teacher-1' },
          { id: 'pe-18', studentId: 'student-2', goalId: 'goal-2-2', date: '2025-11-15', score: 60, notes: 'Self-initiated strategy 3x', promptLevel: 'minimal', teacherId: 'teacher-1' },
          { id: 'pe-19', studentId: 'student-2', goalId: 'goal-2-2', date: '2025-12-01', score: 70, notes: 'Strong week, very self-aware', promptLevel: 'independent', teacherId: 'teacher-1' },
        ],
      },
    ],
    progressEntries: [],
  },
  {
    id: 'student-3',
    teacherId: 'teacher-1',
    name: 'Maya Patel',
    grade: '5th Grade',
    dateOfBirth: '2014-11-05',
    disabilityCategory: 'Speech or Language Impairment',
    iepStartDate: '2025-09-01',
    iepEndDate: '2026-08-31',
    createdAt: '2025-09-01T00:00:00Z',
    reports: [],
    goals: [
      {
        id: 'goal-3-1',
        studentId: 'student-3',
        area: 'Communication',
        description: 'Maya will produce /r/ sounds correctly in conversational speech with 80% accuracy during structured activities.',
        baseline: '40%',
        target: '80%',
        measurementType: 'percentage',
        createdAt: '2025-09-01T00:00:00Z',
        progressEntries: [
          { id: 'pe-20', studentId: 'student-3', goalId: 'goal-3-1', date: '2025-09-15', score: 42, notes: 'Correct in isolation, inconsistent in words', promptLevel: 'moderate', teacherId: 'teacher-1' },
          { id: 'pe-21', studentId: 'student-3', goalId: 'goal-3-1', date: '2025-10-15', score: 55, notes: 'Improvement in word-level production', promptLevel: 'moderate', teacherId: 'teacher-1' },
          { id: 'pe-22', studentId: 'student-3', goalId: 'goal-3-1', date: '2025-11-15', score: 68, notes: 'Strong in structured reading aloud', promptLevel: 'minimal', teacherId: 'teacher-1' },
          { id: 'pe-23', studentId: 'student-3', goalId: 'goal-3-1', date: '2025-12-01', score: 72, notes: 'Near target in structured tasks', promptLevel: 'minimal', teacherId: 'teacher-1' },
        ],
      },
    ],
    progressEntries: [],
  },
  // Teacher 2 — Marcus Williams
  {
    id: 'student-4',
    teacherId: 'teacher-2',
    name: 'Liam Thompson',
    grade: '7th Grade',
    dateOfBirth: '2012-04-18',
    disabilityCategory: 'Other Health Impairment (ADHD)',
    iepStartDate: '2025-09-01',
    iepEndDate: '2026-08-31',
    createdAt: '2025-09-01T00:00:00Z',
    reports: [],
    goals: [
      {
        id: 'goal-4-1',
        studentId: 'student-4',
        area: 'Executive Function',
        description: 'Liam will complete multi-step assignments by using a planner/checklist with no more than 1 teacher prompt per class period, 4 out of 5 days.',
        baseline: '1 out of 5 days',
        target: '4 out of 5 days',
        measurementType: 'frequency',
        createdAt: '2025-09-01T00:00:00Z',
        progressEntries: [
          { id: 'pe-24', studentId: 'student-4', goalId: 'goal-4-1', date: '2025-09-15', score: 20, notes: 'Forgot planner 3 days', promptLevel: 'maximum', teacherId: 'teacher-2' },
          { id: 'pe-25', studentId: 'student-4', goalId: 'goal-4-1', date: '2025-10-01', score: 40, notes: 'Used planner 2 days independently', promptLevel: 'moderate', teacherId: 'teacher-2' },
          { id: 'pe-26', studentId: 'student-4', goalId: 'goal-4-1', date: '2025-11-01', score: 60, notes: '3 out of 5 days, improving', promptLevel: 'minimal', teacherId: 'teacher-2' },
          { id: 'pe-27', studentId: 'student-4', goalId: 'goal-4-1', date: '2025-12-01', score: 75, notes: 'Best week yet, very consistent', promptLevel: 'minimal', teacherId: 'teacher-2' },
        ],
      },
    ],
    progressEntries: [],
  },
  {
    id: 'student-5',
    teacherId: 'teacher-2',
    name: 'Sofia Chen',
    grade: '6th Grade',
    dateOfBirth: '2013-08-30',
    disabilityCategory: 'Specific Learning Disability',
    iepStartDate: '2025-09-01',
    iepEndDate: '2026-08-31',
    createdAt: '2025-09-01T00:00:00Z',
    reports: [],
    goals: [
      {
        id: 'goal-5-1',
        studentId: 'student-5',
        area: 'Math',
        description: 'Sofia will solve one-variable algebraic equations with 75% accuracy across 4 out of 5 trials without a calculator.',
        baseline: '20%',
        target: '75%',
        measurementType: 'percentage',
        createdAt: '2025-09-01T00:00:00Z',
        progressEntries: [
          { id: 'pe-28', studentId: 'student-5', goalId: 'goal-5-1', date: '2025-09-15', score: 22, notes: 'Needs step-by-step visual', promptLevel: 'maximum', teacherId: 'teacher-2' },
          { id: 'pe-29', studentId: 'student-5', goalId: 'goal-5-1', date: '2025-10-15', score: 38, notes: 'Better with anchor chart reference', promptLevel: 'moderate', teacherId: 'teacher-2' },
          { id: 'pe-30', studentId: 'student-5', goalId: 'goal-5-1', date: '2025-11-15', score: 52, notes: 'Solving simple equations independently', promptLevel: 'minimal', teacherId: 'teacher-2' },
          { id: 'pe-31', studentId: 'student-5', goalId: 'goal-5-1', date: '2025-12-01', score: 63, notes: 'Solid progress, near halfway to goal', promptLevel: 'minimal', teacherId: 'teacher-2' },
        ],
      },
    ],
    progressEntries: [],
  },
]

// ── Global store ───────────────────────────────────────────────────────────

declare global {
  var __waypointStore: {
    students: Student[]
    reports: Report[]
    nextId: number
  } | undefined
}

function getStore() {
  if (!global.__waypointStore) {
    global.__waypointStore = {
      students: JSON.parse(JSON.stringify(seedStudents)),
      reports: [],
      nextId: 100,
    }
  }
  return global.__waypointStore
}

function nextId(): string {
  const store = getStore()
  return String(store.nextId++)
}

// ── Student queries ────────────────────────────────────────────────────────

export function getStudentsByTeacher(teacherId: string): Student[] {
  return getStore().students.filter(s => s.teacherId === teacherId)
}

export function getStudentById(id: string, teacherId: string): Student | null {
  return getStore().students.find(s => s.id === id && s.teacherId === teacherId) ?? null
}

export function createStudent(data: {
  name: string
  grade: string
  dateOfBirth?: string | null
  disabilityCategory?: string | null
  iepStartDate?: string | null
  iepEndDate?: string | null
  teacherId: string
  goals?: { area: string; description: string; baseline?: string; target?: string; measurementType?: string }[]
}): Student {
  const store = getStore()
  const id = `student-${nextId()}`
  const goals: Goal[] = (data.goals ?? []).map(g => ({
    id: `goal-${nextId()}`,
    studentId: id,
    area: g.area,
    description: g.description,
    baseline: g.baseline ?? null,
    target: g.target ?? null,
    measurementType: g.measurementType ?? null,
    createdAt: new Date().toISOString(),
    progressEntries: [],
  }))

  const student: Student = {
    id,
    teacherId: data.teacherId,
    name: data.name,
    grade: data.grade,
    dateOfBirth: data.dateOfBirth ?? null,
    disabilityCategory: data.disabilityCategory ?? null,
    iepStartDate: data.iepStartDate ?? null,
    iepEndDate: data.iepEndDate ?? null,
    createdAt: new Date().toISOString(),
    goals,
    progressEntries: [],
    reports: [],
  }

  store.students.push(student)
  return student
}

export function updateStudent(id: string, teacherId: string, data: Partial<Student>): Student | null {
  const store = getStore()
  const idx = store.students.findIndex(s => s.id === id && s.teacherId === teacherId)
  if (idx === -1) return null
  store.students[idx] = { ...store.students[idx], ...data }
  return store.students[idx]
}

export function deleteStudent(id: string, teacherId: string): boolean {
  const store = getStore()
  const idx = store.students.findIndex(s => s.id === id && s.teacherId === teacherId)
  if (idx === -1) return false
  store.students.splice(idx, 1)
  return true
}

// ── Progress entries ───────────────────────────────────────────────────────

export function addProgressEntry(data: {
  studentId: string
  goalId: string
  date?: string
  score?: number | null
  notes?: string | null
  promptLevel?: string | null
  teacherId: string
}): ProgressEntry | null {
  const store = getStore()
  const student = store.students.find(s => s.id === data.studentId)
  if (!student) return null
  const goal = student.goals.find(g => g.id === data.goalId)
  if (!goal) return null

  const entry: ProgressEntry = {
    id: `pe-${nextId()}`,
    studentId: data.studentId,
    goalId: data.goalId,
    date: data.date ?? new Date().toISOString(),
    score: data.score ?? null,
    notes: data.notes ?? null,
    promptLevel: data.promptLevel ?? null,
    teacherId: data.teacherId,
    goal,
  }

  goal.progressEntries.push(entry)
  student.progressEntries.push(entry)
  return entry
}

export function getProgressEntries(studentId: string, teacherId: string): ProgressEntry[] {
  const store = getStore()
  const student = store.students.find(s => s.id === studentId && s.teacherId === teacherId)
  if (!student) return []
  return student.goals.flatMap(g => g.progressEntries).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

// ── Reports ────────────────────────────────────────────────────────────────

export function saveReport(data: {
  studentId: string
  teacherId: string
  reportingPeriod: string
  content: string
}): Report {
  const store = getStore()
  const report: Report = {
    id: `report-${nextId()}`,
    ...data,
    generatedAt: new Date().toISOString(),
  }
  store.reports.push(report)

  // Also attach to student
  const student = store.students.find(s => s.id === data.studentId)
  if (student) student.reports.unshift(report)

  return report
}
