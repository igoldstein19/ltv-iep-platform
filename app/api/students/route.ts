import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getStudentsByTeacher, createStudent } from '@/lib/store'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id
    const students = getStudentsByTeacher(userId)
    return NextResponse.json(students)
  } catch (error) {
    console.error('GET /api/students error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id
    const body = await request.json()
    const { name, grade, dateOfBirth, disabilityCategory, iepStartDate, iepEndDate, goals } = body

    if (!name || !grade) {
      return NextResponse.json({ error: 'Name and grade are required' }, { status: 400 })
    }

    const student = createStudent({
      name,
      grade,
      dateOfBirth: dateOfBirth || null,
      disabilityCategory: disabilityCategory || null,
      iepStartDate: iepStartDate || null,
      iepEndDate: iepEndDate || null,
      teacherId: userId,
      goals: goals || [],
    })

    return NextResponse.json(student, { status: 201 })
  } catch (error) {
    console.error('POST /api/students error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
