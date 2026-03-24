'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { X, Save, Loader2 } from 'lucide-react'
import { Goal } from '@/types'
import { PROMPT_LEVELS } from '@/types'
import { getGoalAreaColor } from '@/lib/utils'

interface ProgressEntryFormProps {
  studentId: string
  goals: Goal[]
  defaultGoalId?: string
  onSuccess: () => void
  onCancel: () => void
}

export default function ProgressEntryForm({
  studentId,
  goals,
  defaultGoalId,
  onSuccess,
  onCancel,
}: ProgressEntryFormProps) {
  const [selectedGoalId, setSelectedGoalId] = useState(defaultGoalId || goals[0]?.id || '')
  const [score, setScore] = useState('')
  const [notes, setNotes] = useState('')
  const [promptLevel, setPromptLevel] = useState('independent')
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const selectedGoal = goals.find((g) => g.id === selectedGoalId)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`/api/students/${studentId}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goalId: selectedGoalId,
          date: new Date(date).toISOString(),
          score: score ? parseFloat(score) : null,
          notes: notes || null,
          promptLevel: promptLevel || null,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save entry')
      }

      onSuccess()
    } catch (err: any) {
      setError(err.message || 'Failed to save progress entry')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
        <h3 className="font-bold text-slate-800 text-base">Log Progress Entry</h3>
        <button
          onClick={onCancel}
          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Goal Select */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Goal</label>
          <select
            value={selectedGoalId}
            onChange={(e) => setSelectedGoalId(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          >
            {goals.map((goal) => (
              <option key={goal.id} value={goal.id}>
                {goal.area}: {goal.description.substring(0, 60)}...
              </option>
            ))}
          </select>
          {selectedGoal && (
            <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full font-medium ${getGoalAreaColor(selectedGoal.area)}`}>
              {selectedGoal.area}
            </span>
          )}
        </div>

        {/* Date and Score */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Score (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              placeholder="e.g. 75"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Prompt Level */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Prompt Level</label>
          <div className="flex flex-wrap gap-2">
            {PROMPT_LEVELS.map((level) => (
              <button
                key={level.value}
                type="button"
                onClick={() => setPromptLevel(level.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                  promptLevel === level.value
                    ? 'bg-indigo-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Observation Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Describe what you observed, strategies used, student behavior..."
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">{error}</p>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !selectedGoalId}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 rounded-xl transition-colors disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {loading ? 'Saving...' : 'Save Entry'}
          </button>
        </div>
      </form>
    </div>
  )
}
