'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ChevronRight,
  Calendar,
  BookOpen,
  FileText,
  Plus,
  Loader2,
  ClipboardList,
  Target,
} from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import TopNav from '@/components/TopNav'
import GoalCard from '@/components/GoalCard'
import ProgressEntryForm from '@/components/ProgressEntryForm'
import StatusBadge from '@/components/StatusBadge'
import { StudentWithDetails } from '@/types'
import {
  calculateStudentStatus,
  getAvatarColor,
  getInitials,
  formatDate,
} from '@/lib/utils'

export default function StudentDetailPage() {
  const params = useParams()
  const studentId = params.id as string

  const [student, setStudent] = useState<StudentWithDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [showQuickLog, setShowQuickLog] = useState(false)

  const fetchStudent = useCallback(async () => {
    try {
      const res = await fetch(`/api/students/${studentId}`)
      if (res.ok) {
        const data = await res.json()
        setStudent(data)
      }
    } catch (err) {
      console.error('Failed to fetch student:', err)
    } finally {
      setLoading(false)
    }
  }, [studentId])

  useEffect(() => {
    fetchStudent()
  }, [fetchStudent])

  function handleProgressLogged() {
    fetchStudent()
    setShowQuickLog(false)
  }

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
          <div className="text-center">
            <p className="text-lg font-semibold text-slate-700">Student not found</p>
            <Link href="/students" className="text-sm text-indigo-500 mt-2 block">
              Back to Students
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const allScores = student.goals.flatMap((goal) =>
    goal.progressEntries
      .filter((e) => e.score !== null)
      .map((e) => e.score as number)
  )
  const status = calculateStudentStatus(allScores)
  const initials = getInitials(student.name)
  const avatarColor = getAvatarColor(student.name)

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-64">
        <TopNav title={student.name} />

        <div className="p-6 space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/dashboard" className="hover:text-slate-600">Dashboard</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/students" className="hover:text-slate-600">Students</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-600">{student.name}</span>
          </div>

          {/* Student Hero */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={`w-16 h-16 ${avatarColor} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white text-xl font-bold">{initials}</span>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-2xl font-bold text-slate-800">{student.name}</h1>
                    <StatusBadge status={status} />
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-slate-400" />
                      {student.grade} Grade
                    </span>
                    {student.disabilityCategory && (
                      <span className="flex items-center gap-1.5">
                        <Target className="w-4 h-4 text-slate-400" />
                        {student.disabilityCategory}
                      </span>
                    )}
                    {student.iepStartDate && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        IEP: {formatDate(student.iepStartDate)} – {formatDate(student.iepEndDate)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowQuickLog(!showQuickLog)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Quick Log
                </button>
                <Link
                  href={`/students/${student.id}/report`}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-indigo-500 hover:bg-indigo-600 rounded-xl transition-colors shadow-sm"
                >
                  <FileText className="w-4 h-4" />
                  Generate Report
                </Link>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-slate-100">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-800">{student.goals.length}</p>
                <p className="text-xs text-slate-500 mt-0.5">IEP Goals</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-800">{student.progressEntries.length}</p>
                <p className="text-xs text-slate-500 mt-0.5">Total Entries</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-800">
                  {allScores.length > 0
                    ? `${Math.round(allScores.slice(-5).reduce((a, b) => a + b, 0) / Math.min(allScores.slice(-5).length, 5))}%`
                    : 'N/A'
                  }
                </p>
                <p className="text-xs text-slate-500 mt-0.5">Avg Score (last 5)</p>
              </div>
            </div>
          </div>

          {/* Quick Log Form */}
          {showQuickLog && student.goals.length > 0 && (
            <div className="animate-fade-in">
              <ProgressEntryForm
                studentId={student.id}
                goals={student.goals}
                onSuccess={handleProgressLogged}
                onCancel={() => setShowQuickLog(false)}
              />
            </div>
          )}

          {/* Goals */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-indigo-500" />
                IEP Goals & Progress
              </h2>
              <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                {student.goals.length} goal{student.goals.length !== 1 ? 's' : ''}
              </span>
            </div>

            {student.goals.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
                <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 font-semibold">No goals added yet</p>
                <p className="text-sm text-slate-400 mt-1">
                  Goals are added when creating a student or uploading an IEP
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {student.goals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    studentId={student.id}
                    onProgressLogged={fetchStudent}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
