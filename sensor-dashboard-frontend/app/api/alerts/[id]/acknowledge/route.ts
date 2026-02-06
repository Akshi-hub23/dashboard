import { NextResponse } from 'next/server'
import { acknowledgeAlert } from '@/lib/backend-data'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id
  const alert = acknowledgeAlert(id)

  if (!alert) {
    return NextResponse.json({ message: 'Alert not found' }, { status: 404 })
  }

  return NextResponse.json(alert)
}
