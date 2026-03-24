'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Users, TrendingUp, AlertTriangle, FileText, Plus, Filter, Loader2 } from 'lucide-react'
import TopNav from '@/components/TopNav'
import StudentCard from '@/components/StudentCard'
import { Student, GoalWithEntries } from '@/types'
import { calculateStudentStatus } from '@/lib/utils'

type FilterType = 'all' | 'on-track' | 'needs-attention' | 'at-risk'

export default function DashboardPage() {
  const [students, setStudents] = useState<(Student & { goals: GoalWithEntries[] })[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterType>('all')

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
    } catch (err) {
      console.error('Failed to fetch students:', err)
    } finally {
      setLoading(false)
    }
  }

  const studentsWithStatus = students.map((student) => {
    const allScores = student.goals.flatMap((goal) =>
      (goal.progressEntries || [])
        .filter((e) => e.score !== null)
        .map((e) => e.score as number)
    )
    return { ...student, status: calculateStudentStatus(allScores) }
  })

  const stats = {
    total: students.length,
    onTrack: studentsWithStatus.filter((s) => s.status === 'on-track').length,
    needsAttention: studentsWithStatus.filter((s) => s.status === 'needs-attention').length,
    atRisk: studentsWithStatus.filter((s) => s.status === 'at-risk').length,
  }

  const filteredStudents = studentsWithStatus.filter((s) => {
    if (filter === 'all') return true
    return s.status === filter
  })

  const filterButtons: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All Students' },
    { key: 'on-track', label: 'On Track' },
    { key: 'needs-attention', label: 'Needs Attention' },
    { key: 'at-risk', label: 'At Risk' },
  ]

  return (
    <div>
      <TopNav showGreeting subtitle="Here's your class overview for today." />

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-card border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-indigo-600" />
              </div>
              <span className="text-xs font-medium text-slate-400">Total</span>
            </div>
            <p className="text-3xl font-bold text-slate-800">{stats.total}</p>
            <p className="text-sm text-slate-500 mt-1">Students</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-card border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-xs font-medium text-slate-400">Great</span>
            </div>
            <p className="text-3xl font-bold text-emerald-600">{stats.onTrack}</p>
            <p className="text-sm text-slate-500 mt-1">On Track</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-card border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-xs font-medium text-slate-400">Watch</span>
            </div>
            <p className="text-3xl font-bold text-amber-600">{stats.needsAttention}</p>
            <p className="text-sm text-slate-500 mt-1">Needs Attention</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-card border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-indigo-600" />
              </div>
              <span className="text-xs font-medium text-slate-400">Action</span>
            </div>
            <p className="text-3xl font-bold text-indigo-600">{stats.total}</p>
            <p className="text-sm text-slate-500 mt-1">Reports Available</p>
          </div>
        </div>

        {/* Students Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h3 className="text-base font-bold text-slate-800">My Students</h3>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                {filteredStudents.length}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {/* Filter Buttons */}
              <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
                {filterButtons.map((btn) => (
                  <button
                    key={btn.key}
                    onClick={() => setFilter(btn.key)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      filter === btn.key
                        ? 'bg-white text-slate-800 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
              <Link
                href="/students/new"
                className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Student
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 font-semibold">
                {filter === 'all' ? 'No students yet' : `No students with "${filter.replace('-', ' ')}" status`}
              </p>
              <p className="text-sm text-slate-400 mt-1 mb-6">
                {filter === 'all'
                  ? 'Add your first student to get started'
                  : 'Try changing the filter'}
              </p>
              {filter === 'all' && (
                <Link
                  href="/students/new"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add First Student
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredStudents.map((student) => (
                <StudentCard key={student.id} student={student} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
