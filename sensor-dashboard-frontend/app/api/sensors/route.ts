import { NextResponse } from 'next/server'
import { getSensors } from '@/lib/backend-data'

export async function GET() {
  const sensors = getSensors()
  return NextResponse.json(sensors)
}
