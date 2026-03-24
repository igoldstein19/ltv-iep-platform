'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FileText, Users, ChevronRight, Loader2, Clock, Sparkles } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import TopNav from '@/components/TopNav'
import { Student, GoalWithEntries } from '@/types'
import { getAvatarColor, getInitials, calculateStudentStatus } from '@/lib/utils'
import StatusBadge from '@/components/StatusBadge'

export default function ReportsPage() {
  const [students, setStudents] = useState<(Student & { goals: GoalWithEntries[] })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStudents()
  }, [])

  async function fetchStudents() {
    try {
      const res = await fetch('/api/students')
      if (res.ok) {
        const data = await res.json()
        setStudents(data)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-64">
        <TopNav title="Progress Reports" subtitle="Generate AI-powered reports for your students" />

        <div className="p-6 space-y-6">
          {/* Info Banner */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold mb-1">AI-Powered Progress Reports</h2>
                <p className="text-indigo-100 text-sm leading-relaxed">
                  Generate professional, parent-friendly progress reports in seconds.
                  Claude analyzes your student's IEP goals and progress data to write
                  warm, specific narratives that save you hours each quarter.
                </p>
              </div>
            </div>
          </div>

          {/* Students Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 font-semibold">No students yet</p>
              <Link
                href="/students/new"
                className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl"
              >
                Add First Student
              </Link>
            </div>
          ) : (
            <div>
              <h3 className="text-sm font-bold text-slate-700 mb-4">Select a student to generate a report</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {students.map((student) => {
                  const allScores = student.goals.flatMap((goal) =>
                    (goal.progressEntries || [])
                      .filter((e) => e.score !== null)
                      .map((e) => e.score as number)
                  )
                  const status = calculateStudentStatus(allScores)
                  const initials = getInitials(student.name)
                  const avatarColor = getAvatarColor(student.name)
                  const totalEntries = student.goals.reduce(
                    (acc, g) => acc + (g.progressEntries || []).length, 0
                  )

                  return (
                    <div key={student.id} className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
                      <div className="flex items-start gap-3 mb-4">
                        <div className={`w-11 h-11 ${avatarColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
                          <span className="text-white text-sm font-bold">{initials}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-800">{student.name}</h4>
                          <p className="text-xs text-slate-500">{student.grade} Grade</p>
                        </div>
                        <StatusBadge status={status} size="sm" />
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-500 mb-5">
                        <span className="flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5" />
                          {student.goals.length} goals
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {totalEntries} entries
                        </span>
                      </div>

                      <Link
                        href={`/students/${student.id}/report`}
                        className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold text-white bg-indigo-500 hover:bg-indigo-600 rounded-xl transition-colors"
                      >
                        <Sparkles className="w-4 h-4" />
                        Generate Report
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      </Link>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
