'use client'

import { useState } from 'react'
import { Plus, ChevronDown, ChevronUp, Target, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { GoalWithEntries } from '@/types'
import { getGoalAreaColor, getGoalAreaBgColor, calculateTrend, formatDate, getPromptLevelLabel } from '@/lib/utils'
import ProgressChart from './ProgressChart'
import ProgressEntryForm from './ProgressEntryForm'
import { format } from 'date-fns'

interface GoalCardProps {
  goal: GoalWithEntries
  studentId: string
  onProgressLogged: () => void
}

export default function GoalCard({ goal, studentId, onProgressLogged }: GoalCardProps) {
  const [showForm, setShowForm] = useState(false)
  const [expanded, setExpanded] = useState(true)

  const scores = goal.progressEntries
    .filter((e) => e.score !== null)
    .map((e) => e.score as number)

  const latestScore = scores.length > 0 ? scores[scores.length - 1] : null
  const trend = calculateTrend(scores)

  const TrendIcon = trend === 'improving' ? TrendingUp : trend === 'declining' ? TrendingDown : Minus
  const trendColor = trend === 'improving' ? 'text-emerald-500' : trend === 'declining' ? 'text-red-500' : 'text-slate-400'

  const recentEntries = [...goal.progressEntries]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  const areaColor = getGoalAreaBgColor(goal.area)

  function handleSuccess() {
    setShowForm(false)
    onProgressLogged()
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
      {/* Goal Header */}
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3 flex-1">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ backgroundColor: `${areaColor}20` }}
            >
              <Target className="w-4 h-4" style={{ color: areaColor }} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${getGoalAreaColor(goal.area)}`}>
                  {goal.area}
                </span>
                <TrendIcon className={`w-3.5 h-3.5 ${trendColor}`} />
              </div>
              <p className="text-sm text-slate-700 font-medium leading-snug">{goal.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-3 flex-shrink-0">
            {latestScore !== null && (
              <div className="text-right">
                <p className="text-xl font-bold text-slate-800">{latestScore}%</p>
                <p className="text-xs text-slate-400">latest</p>
              </div>
            )}
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Baseline → Target */}
        {(goal.baseline || goal.target) && (
          <div className="flex items-center gap-3 text-xs text-slate-500 bg-slate-50 rounded-xl px-3 py-2">
            <div className="flex-1">
              <span className="text-slate-400 font-medium">Baseline: </span>
              <span>{goal.baseline || 'Not specified'}</span>
            </div>
            <div className="text-slate-300">→</div>
            <div className="flex-1 text-right">
              <span className="text-emerald-600 font-medium">Target: </span>
              <span>{goal.target || 'Not specified'}</span>
            </div>
          </div>
        )}
      </div>

      {expanded && (
        <>
          {/* Chart */}
          <div className="px-5 pb-4">
            <ProgressChart
              entries={goal.progressEntries}
              color={areaColor}
              height={160}
            />
          </div>

          {/* Recent Entries */}
          {recentEntries.length > 0 && (
            <div className="px-5 pb-4">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Recent Entries</h4>
              <div className="space-y-2">
                {recentEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl"
                  >
                    <div className="flex-shrink-0 text-center min-w-[2.5rem]">
                      {entry.score !== null ? (
                        <span className="text-sm font-bold text-slate-800">{entry.score}%</span>
                      ) : (
                        <span className="text-xs text-slate-400">N/A</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-medium text-slate-600">
                          {format(new Date(entry.date), 'MMM d, yyyy')}
                        </span>
                        {entry.promptLevel && (
                          <span className="text-xs text-slate-400">
                            · {getPromptLevelLabel(entry.promptLevel)}
                          </span>
                        )}
                      </div>
                      {entry.notes && (
                        <p className="text-xs text-slate-500 line-clamp-2">{entry.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Log Progress */}
          <div className="px-5 pb-5">
            {showForm ? (
              <ProgressEntryForm
                studentId={studentId}
                goals={[goal]}
                defaultGoalId={goal.id}
                onSuccess={handleSuccess}
                onCancel={() => setShowForm(false)}
              />
            ) : (
              <button
                onClick={() => setShowForm(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-indigo-600 border-2 border-dashed border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 rounded-xl transition-colors"
              >
                <Plus className="w-4 h-4" />
                Log Progress
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
