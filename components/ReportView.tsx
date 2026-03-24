'use client'

import { TrendingUp, TrendingDown, Minus, Target, Printer, Compass } from 'lucide-react'
import { format } from 'date-fns'
import { ReportContent } from '@/types'
import { getGoalAreaColor, getGoalAreaBgColor } from '@/lib/utils'
import {
  LineChart,
  Line,
  ResponsiveContainer,
} from 'recharts'

interface ReportViewProps {
  student: {
    name: string
    grade: string
    disabilityCategory?: string | null
    iepStartDate?: Date | string | null
    iepEndDate?: Date | string | null
  }
  report: ReportContent
  teacherName: string
  reportingPeriod: string
  goalsData: Array<{
    area: string
    entries: Array<{ date: string; score: number | null }>
  }>
}

export default function ReportView({
  student,
  report,
  teacherName,
  reportingPeriod,
  goalsData,
}: ReportViewProps) {
  function handlePrint() {
    window.print()
  }

  const formatIEPDate = (date: Date | string | null | undefined) => {
    if (!date) return 'N/A'
    try {
      return format(new Date(date), 'MMMM d, yyyy')
    } catch {
      return 'N/A'
    }
  }

  return (
    <div className="print-container">
      {/* Print Button (hidden in print) */}
      <div className="flex justify-end mb-6 no-print">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
        >
          <Printer className="w-4 h-4" />
          Print / Save as PDF
        </button>
      </div>

      {/* Report Document */}
      <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden print-doc">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">Waypoint Learning</h1>
                <p className="text-indigo-200 text-xs">Student Progress Report</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-semibold text-sm">{reportingPeriod}</p>
              <p className="text-indigo-200 text-xs">{format(new Date(), 'MMMM d, yyyy')}</p>
            </div>
          </div>
        </div>

        <div className="px-8 py-6">
          {/* Student Info */}
          <div className="flex items-start justify-between pb-6 border-b border-slate-100">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{student.name}</h2>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm text-slate-500">
                  <span className="font-medium text-slate-700">Grade:</span> {student.grade}
                </span>
                {student.disabilityCategory && (
                  <span className="text-sm text-slate-500">
                    <span className="font-medium text-slate-700">Disability:</span> {student.disabilityCategory}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 mt-1">
                {student.iepStartDate && (
                  <span className="text-sm text-slate-500">
                    <span className="font-medium text-slate-700">IEP Start:</span> {formatIEPDate(student.iepStartDate)}
                  </span>
                )}
                {student.iepEndDate && (
                  <span className="text-sm text-slate-500">
                    <span className="font-medium text-slate-700">IEP End:</span> {formatIEPDate(student.iepEndDate)}
                  </span>
                )}
              </div>
            </div>
            <div className="bg-indigo-50 px-4 py-3 rounded-xl text-right">
              <p className="text-xs text-slate-500 mb-1">Teacher</p>
              <p className="text-sm font-bold text-slate-800">{teacherName}</p>
            </div>
          </div>

          {/* Overall Summary */}
          <div className="py-6 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-800 mb-3">Overall Summary</h3>
            <div className="bg-indigo-50 rounded-xl px-5 py-4">
              <p className="text-sm text-slate-700 leading-relaxed">{report.summary}</p>
            </div>
          </div>

          {/* Goal Narratives */}
          <div className="pt-6">
            <h3 className="text-base font-bold text-slate-800 mb-4">IEP Goal Progress</h3>
            <div className="space-y-5">
              {report.goalNarratives.map((goalNarrative, index) => {
                const goalData = goalsData.find((g) => g.area === goalNarrative.area)
                const sparklineData = goalData?.entries
                  .filter((e) => e.score !== null)
                  .slice(-8)
                  .map((e) => ({ score: e.score })) || []

                const TrendIcon = goalNarrative.trend === 'improving'
                  ? TrendingUp
                  : goalNarrative.trend === 'declining'
                  ? TrendingDown
                  : Minus

                const trendColor = goalNarrative.trend === 'improving'
                  ? 'text-emerald-500'
                  : goalNarrative.trend === 'declining'
                  ? 'text-red-500'
                  : 'text-slate-400'

                const areaColor = getGoalAreaBgColor(goalNarrative.area)

                return (
                  <div key={index} className="border border-slate-100 rounded-xl p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${areaColor}20` }}
                        >
                          <Target className="w-4 h-4" style={{ color: areaColor }} />
                        </div>
                        <div>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${getGoalAreaColor(goalNarrative.area)}`}>
                            {goalNarrative.area}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {sparklineData.length > 1 && (
                          <div className="w-20 h-8 no-print">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={sparklineData}>
                                <Line
                                  type="monotone"
                                  dataKey="score"
                                  stroke={areaColor}
                                  strokeWidth={2}
                                  dot={false}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        )}
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <TrendIcon className={`w-4 h-4 ${trendColor}`} />
                            <span className="text-xl font-bold text-slate-800">
                              {goalNarrative.currentScore}%
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 capitalize">{goalNarrative.trend}</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{goalNarrative.narrative}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              <span>Generated by Waypoint Learning</span>
            </div>
            <span>
              Prepared by {teacherName} · {format(new Date(), 'MMMM d, yyyy')}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
