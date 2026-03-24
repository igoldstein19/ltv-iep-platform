'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { IEPExtractionResult, ExtractedGoal, GOAL_AREAS, MEASUREMENT_TYPES } from '@/types'
import { getGoalAreaColor } from '@/lib/utils'

interface IEPUploaderProps {
  studentName: string
  onExtracted: (data: IEPExtractionResult) => void
}

export default function IEPUploader({ studentName, onExtracted }: IEPUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [extractedData, setExtractedData] = useState<IEPExtractionResult | null>(null)
  const [editingGoals, setEditingGoals] = useState<ExtractedGoal[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const f = acceptedFiles[0]
    if (f) {
      setFile(f)
      setError('')
      setExtractedData(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  async function handleExtract() {
    if (!file) return
    setLoading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('studentName', studentName || 'Student')

      const res = await fetch('/api/iep/extract', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to extract IEP data')
      }

      setExtractedData(data)
      setEditingGoals(data.goals)
    } catch (err: any) {
      setError(err.message || 'Failed to extract IEP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function updateGoal(index: number, field: keyof ExtractedGoal, value: string) {
    const updated = [...editingGoals]
    updated[index] = { ...updated[index], [field]: value }
    setEditingGoals(updated)
  }

  function removeGoal(index: number) {
    setEditingGoals(editingGoals.filter((_, i) => i !== index))
  }

  function addGoal() {
    setEditingGoals([...editingGoals, {
      area: 'Reading',
      description: '',
      baseline: '',
      target: '',
      measurementType: 'percentage',
    }])
  }

  function handleConfirm() {
    if (!extractedData) return
    onExtracted({
      disabilityCategory: extractedData.disabilityCategory,
      goals: editingGoals.filter((g) => g.description.trim()),
    })
  }

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      {!extractedData && (
        <>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              isDragActive
                ? 'border-indigo-400 bg-indigo-50'
                : file
                ? 'border-emerald-400 bg-emerald-50'
                : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
            }`}
          >
            <input {...getInputProps()} />
            {file ? (
              <div className="flex items-center justify-center gap-3">
                <FileText className="w-8 h-8 text-emerald-500" />
                <div className="text-left">
                  <p className="font-semibold text-slate-800">{file.name}</p>
                  <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setFile(null)
                  }}
                  className="ml-auto p-1 text-slate-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Upload className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="font-semibold text-slate-700">
                  {isDragActive ? 'Drop the IEP PDF here' : 'Upload IEP Document'}
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  Drag & drop or click to select · PDF only · Max 10MB
                </p>
              </>
            )}
          </div>

          {file && !loading && (
            <button
              onClick={handleExtract}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-colors"
            >
              <FileText className="w-4 h-4" />
              Extract IEP Goals with AI
            </button>
          )}

          {loading && (
            <div className="flex items-center justify-center gap-3 py-4">
              <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
              <p className="text-sm text-slate-600">Analyzing IEP document with AI...</p>
            </div>
          )}
        </>
      )}

      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-700">Extraction Failed</p>
            <p className="text-sm text-red-600 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Extracted Data Review */}
      {extractedData && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-emerald-700">IEP Successfully Extracted!</p>
              <p className="text-xs text-emerald-600 mt-0.5">
                Found {editingGoals.length} goals. Review and edit below before confirming.
              </p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Disability Category
            </label>
            <p className="text-sm font-medium text-slate-800">{extractedData.disabilityCategory}</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-700">Extracted Goals</h4>
              <button
                onClick={addGoal}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
              >
                + Add Goal
              </button>
            </div>

            {editingGoals.map((goal, index) => (
              <div key={index} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${getGoalAreaColor(goal.area)}`}>
                    {goal.area}
                  </span>
                  <button
                    onClick={() => removeGoal(index)}
                    className="p-1 text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Area</label>
                    <select
                      value={goal.area}
                      onChange={(e) => updateGoal(index, 'area', e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      {GOAL_AREAS.map((a) => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Measurement</label>
                    <select
                      value={goal.measurementType}
                      onChange={(e) => updateGoal(index, 'measurementType', e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
                    className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Baseline</label>
                    <input
                      type="text"
                      value={goal.baseline}
                      onChange={(e) => updateGoal(index, 'baseline', e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Target</label>
                    <input
                      type="text"
                      value={goal.target}
                      onChange={(e) => updateGoal(index, 'target', e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setExtractedData(null)
                setFile(null)
                setEditingGoals([])
              }}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Start Over
            </button>
            <button
              onClick={handleConfirm}
              disabled={editingGoals.filter((g) => g.description.trim()).length === 0}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 rounded-xl transition-colors disabled:opacity-60"
            >
              Use These Goals ({editingGoals.filter((g) => g.description.trim()).length})
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
