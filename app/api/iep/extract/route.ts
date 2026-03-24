export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { extractIEPFromText } from '@/lib/claude'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const studentName = formData.get('studentName') as string || 'Student'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 })
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Dynamic import of pdf-parse to avoid edge runtime issues
    const pdfParse = (await import('pdf-parse')).default
    const pdfData = await pdfParse(buffer)
    const pdfText = pdfData.text

    if (!pdfText || pdfText.trim().length < 50) {
      return NextResponse.json(
        { error: 'Could not extract text from PDF. Please ensure the PDF contains readable text.' },
        { status: 400 }
      )
    }

    const extracted = await extractIEPFromText(pdfText, studentName)

    return NextResponse.json(extracted)
  } catch (error: any) {
    console.error('POST /api/iep/extract error:', error)

    if (error.message?.includes('Failed to parse')) {
      return NextResponse.json(
        { error: 'Failed to extract IEP data. Please check the PDF format.' },
        { status: 422 }
      )
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
