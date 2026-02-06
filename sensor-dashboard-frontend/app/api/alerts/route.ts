import { NextResponse } from 'next/server'
import { getAlerts } from '@/lib/backend-data'

export async function GET() {
  const alerts = getAlerts()
  return NextResponse.json(alerts)
}
