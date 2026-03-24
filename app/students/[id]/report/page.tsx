'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  ChevronRight,
  Loader2,
  Sparkles,
  AlertCircle,
  Calendar,
  RefreshCw,
} from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import TopNav from '@/components/TopNav'
import ReportView from '@/components/ReportView'
import { StudentWithDetails, ReportContent } from '@/types'
import { format } from 'date-fns'

export default function ReportPage() {
  const params = useParams()
  const studentId = params.id as string
  const { data: session } = useSession()

  const [student, setStudent] = useState<StudentWithDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [report, setReport] = useState<ReportContent | null>(null)
  const [error, setError] = useState('')
  const [reportingPeriod, setReportingPeriod] = useState('')

  // Default reporting period to current quarter
  useEffect(() => {
    const now = new Date()
    const month = now.getMonth() + 1
    const year = now.getFullYear()
    let quarter = ''
    if (month >= 9 && month <= 11) quarter = `Fall ${year}`
    else if (month === 12 || month <= 2) quarter = `Winter ${year}`
    else if (month >= 3 && month <= 5) quarter = `Spring ${year}`
    else quarter = `Summer ${year}`
    setReportingPeriod(quarter)
  }, [])

  const fetchStudent = useCallback(async () => {
    try {
      const res = await fetch(`/api/students/${studentId}`)
      if (res.ok) {
        const data = await res.json()
        setStudent(data)
      }
    } finally {
      setLoading(false)
    }
  }, [studentId])

  useEffect(() => {
    fetchStudent()
  }, [fetchStudent])

  async function handleGenerate() {
    setGenerating(true)
    setError('')
    setReport(null)

    try {
      const res = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, reportingPeriod }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate report')
      }

      setReport(data.report)
    } catch (err: any) {
      setError(err.message || 'Failed to generate report. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  const teacherName = session?.user?.name || 'Teacher'

  const goalsData = student?.goals.map((goal) => ({
    area: goal.area,
    entries: (goal.progressEntries || []).map((e) => ({
      date: format(new Date(e.date), 'MMM d'),
      score: e.score ?? null,
    })),
  })) || []

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 ml-64 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
        </main>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 ml-64 flex items-center justify-center">
          <p className="text-slate-600">Student not found</p>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-64">
        <TopNav title="Progress Report" subtitle={student.name} />

        <div className="p-6 max-w-4xl space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-400 no-print">
            <Link href="/dashboard" className="hover:text-slate-600">Dashboard</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/students" className="hover:text-slate-600">Students</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={`/students/${student.id}`} className="hover:text-slate-600">{student.name}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-600">Report</span>
          </div>

          {/* Generate Panel */}
          {!report && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6 no-print">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-slate-800">AI Progress Report Generator</h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Claude will analyze {student.name}'s progress data across all {student.goals.length} IEP goals
                    and write a professional, parent-friendly progress report.
                  </p>

                  <div className="mt-5 flex items-end gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Reporting Period
                      </label>
                      <div className="relative">
                        <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={reportingPeriod}
                          onChange={(e) => setReportingPeriod(e.target.value)}
                          placeholder="e.g. Fall 2024, Q1 2025..."
                          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleGenerate}
                      disabled={generating || student.goals.length === 0 || !reportingPeriod.trim()}
                      className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {generating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                      {generating ? 'Generating...' : 'Generate Report'}
                    </button>
                  </div>

                  {student.goals.length === 0 && (
                    <p className="text-xs text-amber-600 mt-3 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      This student has no goals. Add goals before generating a report.
                    </p>
                  )}
                </div>
              </div>

              {/* Progress summary */}
              <div className="mt-5 pt-5 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Data to be included
                </p>
                <div className="flex flex-wrap gap-2">
                  {student.goals.map((goal) => (
                    <div
                      key={goal.id}
                      className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-600"
                    >
                      <span className="font-medium">{goal.area}</span>
                      <span className="text-slate-400">·</span>
                      <span>{goal.progressEntries.length} entries</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Generating State */}
          {generating && (
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-8 text-center no-print">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-7 h-7 text-indigo-500 animate-spin" />
              </div>
              <p className="font-semibold text-slate-800">Analyzing Progress Data</p>
              <p className="text-sm text-slate-500 mt-1">
                Claude is reviewing {student.name}'s goals and writing personalized narratives...
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl no-print">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-700">Generation Failed</p>
                <p className="text-sm text-red-600 mt-0.5">{error}</p>
              </div>
              <button
                onClick={handleGenerate}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry
              </button>
            </div>
          )}

          {/* Report View */}
          {report && (
            <div className="animate-fade-in">
              {/* Regenerate button */}
              <div className="flex justify-between items-center mb-4 no-print">
                <p className="text-sm text-slate-500">
                  Report generated for <span className="font-medium text-slate-700">{reportingPeriod}</span>
                </p>
                <button
                  onClick={() => { setReport(null); setError('') }}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Regenerate
                </button>
              </div>

              <ReportView
                student={student}
                report={report}
                teacherName={teacherName}
                reportingPeriod={reportingPeriod}
                goalsData={goalsData}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
