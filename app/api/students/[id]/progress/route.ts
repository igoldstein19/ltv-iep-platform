import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getStudentById, getProgressEntries, addProgressEntry } from '@/lib/store'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id
    const student = getStudentById(params.id, userId)

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    const entries = getProgressEntries(params.id, userId)
    return NextResponse.json(entries)
  } catch (error) {
    console.error('GET /api/students/[id]/progress error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id
    const student = getStudentById(params.id, userId)

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    const body = await request.json()
    const { goalId, date, score, notes, promptLevel } = body

    if (!goalId) {
      return NextResponse.json({ error: 'Goal ID is required' }, { status: 400 })
    }

    const entry = addProgressEntry({
      studentId: params.id,
      goalId,
      date: date || new Date().toISOString(),
      score: score !== undefined && score !== null ? parseFloat(score) : null,
      notes: notes || null,
      promptLevel: promptLevel || null,
      teacherId: userId,
    })

    if (!entry) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
    }

    return NextResponse.json(entry, { status: 201 })
  } catch (error) {
    console.error('POST /api/students/[id]/progress error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
