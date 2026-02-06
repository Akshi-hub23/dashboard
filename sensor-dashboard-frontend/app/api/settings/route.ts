import { NextResponse } from 'next/server'
import { getThresholds, updateThresholds } from '@/lib/backend-data'

export async function GET() {
  const thresholds = getThresholds()
  return NextResponse.json(thresholds)
}

export async function POST(request: Request) {
  const body = await request.json()
  if (!body) {
    return NextResponse.json({ message: 'Settings required' }, { status: 400 })
  }
  
  const updated = updateThresholds(body)
  return NextResponse.json({ message: 'Settings updated successfully', thresholds: updated })
}
