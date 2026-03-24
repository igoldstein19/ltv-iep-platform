import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getStudentById, saveReport } from '@/lib/store'
import { generateProgressReport } from '@/lib/claude'
import { calculateTrend } from '@/lib/utils'
import { format } from 'date-fns'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id
    const userName = session.user.name || 'Teacher'
    const body = await request.json()
    const { studentId, reportingPeriod } = body

    if (!studentId || !reportingPeriod) {
      return NextResponse.json(
        { error: 'studentId and reportingPeriod are required' },
        { status: 400 }
      )
    }

    const student = getStudentById(studentId, userId)

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    const goalsData = student.goals.map((goal) => {
      const entries = goal.progressEntries
      const scores = entries
        .filter((e) => e.score !== null)
        .map((e) => e.score as number)
      const trend = calculateTrend(scores)
      const recentScore = scores.length > 0 ? scores[scores.length - 1] : 0

      return {
        area: goal.area,
        description: goal.description,
        baseline: goal.baseline || 'Not specified',
        target: goal.target || 'Not specified',
        measurementType: goal.measurementType || 'percentage',
        recentScore,
        trend,
        entries: entries.slice(-10).map((e) => ({
          date: format(new Date(e.date), 'MMM d, yyyy'),
          score: e.score || 0,
          notes: e.notes || '',
          promptLevel: e.promptLevel || 'not recorded',
        })),
      }
    })

    const reportData = {
      studentName: student.name,
      grade: student.grade,
      disabilityCategory: student.disabilityCategory || 'Not specified',
      iepStartDate: student.iepStartDate
        ? format(new Date(student.iepStartDate), 'MMMM d, yyyy')
        : 'Not specified',
      iepEndDate: student.iepEndDate
        ? format(new Date(student.iepEndDate), 'MMMM d, yyyy')
        : 'Not specified',
      reportingPeriod,
      teacherName: userName,
      goals: goalsData,
    }

    const generatedReport = await generateProgressReport(reportData)

    const report = saveReport({
      studentId,
      teacherId: userId,
      reportingPeriod,
      content: JSON.stringify(generatedReport),
    })

    return NextResponse.json({
      reportId: report.id,
      report: generatedReport,
    })
  } catch (error: any) {
    console.error('POST /api/reports/generate error:', error)
    return NextResponse.json({
      error: 'Failed to generate report',
      detail: error?.message || String(error),
    }, { status: 500 })
  }
}
