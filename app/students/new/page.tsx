'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ChevronRight,
  User,
  BookOpen,
  Plus,
  Trash2,
  Loader2,
  CheckCircle,
  Upload,
} from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import TopNav from '@/components/TopNav'
import IEPUploader from '@/components/IEPUploader'
import {
  DISABILITY_CATEGORIES,
  GRADE_OPTIONS,
  GOAL_AREAS,
  MEASUREMENT_TYPES,
  IEPExtractionResult,
  ExtractedGoal,
} from '@/types'
import { getGoalAreaColor } from '@/lib/utils'

interface GoalInput {
  area: string
  description: string
  baseline: string
  target: string
  measurementType: string
}

const emptyGoal = (): GoalInput => ({
  area: 'Reading',
  description: '',
  baseline: '',
  target: '',
  measurementType: 'percentage',
})

export default function NewStudentPage() {
  const router = useRouter()

  // Student form fields
  const [name, setName] = useState('')
  const [grade, setGrade] = useState('3rd')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [disabilityCategory, setDisabilityCategory] = useState('')
  const [iepStartDate, setIepStartDate] = useState('')
  const [iepEndDate, setIepEndDate] = useState('')
  const [goals, setGoals] = useState<GoalInput[]>([emptyGoal()])

  const [activeTab, setActiveTab] = useState<'manual' | 'upload'>('manual')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function addGoal() {
    setGoals([...goals, emptyGoal()])
  }

  function removeGoal(index: number) {
    if (goals.length <= 1) return
    setGoals(goals.filter((_, i) => i !== index))
  }

  function updateGoal(index: number, field: keyof GoalInput, value: string) {
    const updated = [...goals]
    updated[index] = { ...updated[index], [field]: value }
    setGoals(updated)
  }

  function handleIEPExtracted(data: IEPExtractionResult) {
    if (data.disabilityCategory) {
      setDisabilityCategory(data.disabilityCategory)
    }
    if (data.goals.length > 0) {
      setGoals(data.goals.map((g: ExtractedGoal) => ({
        area: g.area,
        description: g.description,
        baseline: g.baseline || '',
        target: g.target || '',
        measurementType: g.measurementType || 'percentage',
      })))
    }
    setActiveTab('manual')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const validGoals = goals.filter((g) => g.description.trim())

    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          grade,
          dateOfBirth: dateOfBirth || null,
          disabilityCategory: disabilityCategory || null,
          iepStartDate: iepStartDate || null,
          iepEndDate: iepEndDate || null,
          goals: validGoals,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create student')
      }

      router.push(`/students/${data.id}`)
    } catch (err: any) {
      setError(err.message || 'Failed to create student')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-64">
        <TopNav title="Add New Student" />

        <div className="p-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
            <Link href="/dashboard" className="hover:text-slate-600">Dashboard</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/students" className="hover:text-slate-600">Students</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-600">New Student</span>
          </div>

          <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
            {/* Student Info Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-500" />
                <h2 className="text-base font-bold text-slate-800">Student Information</h2>
              </div>
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="e.g. Emma Rodriguez"
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Grade <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    >
                      {GRADE_OPTIONS.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Disability Category
                    </label>
                    <select
                      value={disabilityCategory}
                      onChange={(e) => setDisabilityCategory(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    >
                      <option value="">Select category...</option>
                      {DISABILITY_CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      IEP Start Date
                    </label>
                    <input
                      type="date"
                      value={iepStartDate}
                      onChange={(e) => setIepStartDate(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      IEP End Date
                    </label>
                    <input
                      type="date"
                      value={iepEndDate}
                      onChange={(e) => setIepEndDate(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* IEP Goals Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-500" />
                  <h2 className="text-base font-bold text-slate-800">IEP Goals</h2>
                </div>
                {/* Tabs */}
                <div className="flex items-center bg-slate-100 rounded-lg p-1 gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab('manual')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                      activeTab === 'manual' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'
                    }`}
                  >
                    Enter Manually
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('upload')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                      activeTab === 'upload' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'
                    }`}
                  >
                    <Upload className="w-3 h-3" />
                    Upload IEP PDF
                  </button>
                </div>
              </div>

              <div className="p-6">
                {activeTab === 'upload' ? (
                  <IEPUploader
                    studentName={name || 'Student'}
                    onExtracted={handleIEPExtracted}
                  />
                ) : (
                  <div className="space-y-4">
                    {goals.map((goal, index) => (
                      <div key={index} className="border border-slate-200 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-500">Goal {index + 1}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${getGoalAreaColor(goal.area)}`}>
                              {goal.area}
                            </span>
                          </div>
                          {goals.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeGoal(index)}
                              className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Goal Area</label>
                            <select
                              value={goal.area}
                              onChange={(e) => updateGoal(index, 'area', e.target.value)}
                              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                            >
                              {GOAL_AREAS.map((a) => (
                                <option key={a} value={a}>{a}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Measurement Type</label>
                            <select
                              value={goal.measurementType}
                              onChange={(e) => updateGoal(index, 'measurementType', e.target.value)}
                              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                            >
                              {MEASUREMENT_TYPES.map((m) => (
                                <option key={m.value} value={m.value}>{m.label}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">Goal Description</label>
                          <textarea
                            value={goal.description}
                            onChange={(e) => updateGoal(index, 'description', e.target.value)}
                            rows={2}
                            placeholder="Describe the annual goal in observable, measurable terms..."
                            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Baseline Performance</label>
                            <input
                              type="text"
                              value={goal.baseline}
                              onChange={(e) => updateGoal(index, 'baseline', e.target.value)}
                              placeholder="Current level of performance"
                              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Target/Mastery Criteria</label>
                            <input
                              type="text"
                              value={goal.target}
                              onChange={(e) => updateGoal(index, 'target', e.target.value)}
                              placeholder="e.g. 80% accuracy in 4/5 trials"
                              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={addGoal}
                      className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-indigo-600 border-2 border-dashed border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 rounded-xl transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Another Goal
                    </button>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Submit */}
            <div className="flex gap-3">
              <Link
                href="/students"
                className="px-6 py-3 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading || !name.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                {loading ? 'Creating Student...' : 'Create Student'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
