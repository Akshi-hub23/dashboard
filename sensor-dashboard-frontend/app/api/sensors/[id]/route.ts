import { NextResponse } from 'next/server'
import { getSensorById } from '@/lib/backend-data'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id
  const sensor = getSensorById(id)

  if (!sensor) {
    return NextResponse.json({ message: 'Sensor not found' }, { status: 404 })
  }

  return NextResponse.json(sensor)
}
