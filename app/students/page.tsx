'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Users, Search, Loader2, Calendar, BookOpen } from 'lucide-react'
import { Student, GoalWithEntries } from '@/types'
import { calculateStudentStatus, getAvatarColor, getInitials, formatDate } from '@/lib/utils'
import StatusBadge from '@/components/StatusBadge'
import Sidebar from '@/components/Sidebar'
import TopNav from '@/components/TopNav'

export default function StudentsPage() {
  const [students, setStudents] = useState<(Student & { goals: GoalWithEntries[] })[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

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

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.disabilityCategory || '').toLowerCase().includes(search.toLowerCase()) ||
    s.grade.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-64">
        <TopNav title="Students" subtitle={`${students.length} students in your class`} />

        <div className="p-6 space-y-6">
          {/* Search + Add */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search students..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <Link
              href="/students/new"
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Student
            </Link>
          </div>

          {/* Students Table */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 font-semibold">
                {search ? 'No students match your search' : 'No students yet'}
              </p>
              {!search && (
                <Link
                  href="/students/new"
                  className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl"
                >
                  <Plus className="w-4 h-4" />
                  Add First Student
                </Link>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Disability Category
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      IEP End Date
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Goals
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((student) => {
                    const allScores = student.goals.flatMap((goal) =>
                      (goal.progressEntries || [])
                        .filter((e) => e.score !== null)
                        .map((e) => e.score as number)
                    )
                    const status = calculateStudentStatus(allScores)
                    const initials = getInitials(student.name)
                    const avatarColor = getAvatarColor(student.name)

                    return (
                      <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 ${avatarColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
                              <span className="text-white text-xs font-bold">{initials}</span>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-800">{student.name}</p>
                              <p className="text-xs text-slate-400">{student.grade} Grade</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-slate-600">
                            {student.disabilityCategory || '—'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-sm text-slate-600">
                              {formatDate(student.iepEndDate)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-sm text-slate-600">{student.goals.length} goals</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={status} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/students/${student.id}`}
                              className="px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                            >
                              View
                            </Link>
                            <Link
                              href={`/students/${student.id}/report`}
                              className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                            >
                              Report
                            </Link>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
