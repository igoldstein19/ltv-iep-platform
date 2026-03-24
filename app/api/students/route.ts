import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id

    const students = await prisma.student.findMany({
      where: { teacherId: userId },
      include: {
        goals: {
          include: {
            progressEntries: {
              orderBy: { date: 'desc' },
              take: 10,
            },
          },
        },
        progressEntries: {
          orderBy: { date: 'desc' },
          take: 20,
        },
      },
      orderBy: { name: 'asc' },
    })

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

    const {
      name,
      grade,
      dateOfBirth,
      disabilityCategory,
      iepStartDate,
      iepEndDate,
      goals,
    } = body

    if (!name || !grade) {
      return NextResponse.json(
        { error: 'Name and grade are required' },
        { status: 400 }
      )
    }

    const student = await prisma.student.create({
      data: {
        name,
        grade,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        disabilityCategory: disabilityCategory || null,
        iepStartDate: iepStartDate ? new Date(iepStartDate) : null,
        iepEndDate: iepEndDate ? new Date(iepEndDate) : null,
        teacherId: userId,
        goals: goals && goals.length > 0
          ? {
              create: goals.map((goal: any) => ({
                area: goal.area,
                description: goal.description,
                baseline: goal.baseline || null,
                target: goal.target || null,
                measurementType: goal.measurementType || null,
              })),
            }
          : undefined,
      },
      include: {
        goals: true,
      },
    })

    return NextResponse.json(student, { status: 201 })
  } catch (error) {
    console.error('POST /api/students error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
