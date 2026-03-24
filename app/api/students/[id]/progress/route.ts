import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

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

    // Verify student ownership
    const student = await prisma.student.findFirst({
      where: { id: params.id, teacherId: userId },
    })

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    const entries = await prisma.progressEntry.findMany({
      where: { studentId: params.id },
      include: {
        goal: true,
      },
      orderBy: { date: 'desc' },
    })

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
    const body = await request.json()

    // Verify student ownership
    const student = await prisma.student.findFirst({
      where: { id: params.id, teacherId: userId },
    })

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    const { goalId, date, score, notes, promptLevel } = body

    if (!goalId) {
      return NextResponse.json({ error: 'Goal ID is required' }, { status: 400 })
    }

    // Verify goal belongs to this student
    const goal = await prisma.goal.findFirst({
      where: { id: goalId, studentId: params.id },
    })

    if (!goal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
    }

    const entry = await prisma.progressEntry.create({
      data: {
        studentId: params.id,
        goalId,
        date: date ? new Date(date) : new Date(),
        score: score !== undefined && score !== null ? parseFloat(score) : null,
        notes: notes || null,
        promptLevel: promptLevel || null,
        teacherId: userId,
      },
      include: {
        goal: true,
      },
    })

    return NextResponse.json(entry, { status: 201 })
  } catch (error) {
    console.error('POST /api/students/[id]/progress error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
