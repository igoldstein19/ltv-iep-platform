'use client'

import Link from 'next/link'
import { BarChart2, ClipboardList, BookOpen, Calendar } from 'lucide-react'
import { Student, GoalWithEntries } from '@/types'
import {
  calculateStudentStatus,
  getAvatarColor,
  getInitials,
  getGoalAreaBgColor,
  formatDate,
} from '@/lib/utils'
import StatusBadge from './StatusBadge'

interface StudentCardProps {
  student: Student & { goals: GoalWithEntries[] }
}

export default function StudentCard({ student }: StudentCardProps) {
  // Calculate overall status from all progress entries
  const allScores = student.goals.flatMap((goal) =>
    (goal.progressEntries || [])
      .filter((e) => e.score !== null)
      .map((e) => e.score as number)
  )
  const status = calculateStudentStatus(allScores)
  const initials = getInitials(student.name)
  const avatarColor = getAvatarColor(student.name)

  // Get latest score per goal for progress bars
  const goalProgress = student.goals.map((goal) => {
    const scores = (goal.progressEntries || [])
      .filter((e) => e.score !== null)
      .map((e) => e.score as number)
    const latestScore = scores.length > 0 ? scores[scores.length - 1] : null
    return {
      area: goal.area,
      score: latestScore,
      color: getGoalAreaBgColor(goal.area),
    }
  })

  return (
    <div className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden border border-slate-100 group">
      {/* Card Header */}
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 ${avatarColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <span className="text-white text-sm font-bold">{initials}</span>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base leading-tight">{student.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {student.grade} Grade
                {student.disabilityCategory && ` · ${student.disabilityCategory}`}
              </p>
            </div>
          </div>
          <StatusBadge status={status} size="sm" />
        </div>

        {/* IEP Date */}
        {student.iepEndDate && (
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
            <Calendar className="w-3.5 h-3.5" />
            <span>IEP ends {formatDate(student.iepEndDate)}</span>
          </div>
        )}

        {/* Goal Progress Bars */}
        {goalProgress.length > 0 && (
          <div className="space-y-2">
            {goalProgress.map((goal, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-500 font-medium">{goal.area}</span>
                  <span className="text-xs font-semibold text-slate-700">
                    {goal.score !== null ? `${goal.score}%` : 'No data'}
                  </span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${goal.score !== null ? Math.min(goal.score, 100) : 0}%`,
                      backgroundColor: goal.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {goalProgress.length === 0 && (
          <p className="text-xs text-slate-400 italic">No goals added yet</p>
        )}
      </div>

      {/* Card Actions */}
      <div className="px-5 pb-5 flex gap-2">
        <Link
          href={`/students/${student.id}`}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
        >
          <BarChart2 className="w-3.5 h-3.5" />
          View Progress
        </Link>
        <Link
          href={`/students/${student.id}/report`}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <ClipboardList className="w-3.5 h-3.5" />
          Report
        </Link>
      </div>
    </div>
  )
}
