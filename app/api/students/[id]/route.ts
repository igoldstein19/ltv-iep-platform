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

    const student = await prisma.student.findFirst({
      where: {
        id: params.id,
        teacherId: userId,
      },
      include: {
        goals: {
          include: {
            progressEntries: {
              orderBy: { date: 'asc' },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
        progressEntries: {
          orderBy: { date: 'desc' },
        },
        reports: {
          orderBy: { generatedAt: 'desc' },
          take: 5,
        },
      },
    })

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    return NextResponse.json(student)
  } catch (error) {
    console.error('GET /api/students/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
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

    // Verify ownership
    const existing = await prisma.student.findFirst({
      where: { id: params.id, teacherId: userId },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    const updated = await prisma.student.update({
      where: { id: params.id },
      data: {
        name: body.name,
        grade: body.grade,
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
        disabilityCategory: body.disabilityCategory || null,
        iepStartDate: body.iepStartDate ? new Date(body.iepStartDate) : null,
        iepEndDate: body.iepEndDate ? new Date(body.iepEndDate) : null,
      },
      include: {
        goals: {
          include: {
            progressEntries: {
              orderBy: { date: 'asc' },
            },
          },
        },
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('PUT /api/students/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id

    const existing = await prisma.student.findFirst({
      where: { id: params.id, teacherId: userId },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    await prisma.student.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/students/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
