import { NextResponse } from 'next/server'
import { dbAll, dbRun, dbGet } from '@/lib/sqlite'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const rows = dbAll<any>(`SELECT id, title, start_date as startDate, end_date as endDate, school, contact, phone, commission, photo_price as photoPrice, notes, participants_count as participantsCount, status FROM events ORDER BY start_date DESC`)
  return NextResponse.json(rows)
}

export async function POST(request: Request) {
  const body = await request.json()
  const id = Date.now().toString()
  dbRun(
    `INSERT INTO events (id, title, start_date, end_date, school, contact, phone, commission, photo_price, notes, participants_count, status)
     VALUES (@id, @title, @start_date, @end_date, @school, @contact, @phone, @commission, @photo_price, @notes, 0, 'upcoming')`,
    {
      id,
      title: body.title,
      start_date: body.startDate,
      end_date: body.endDate ?? null,
      school: body.school,
      contact: body.contact,
      phone: body.phone,
      commission: body.commission ?? 15.0,
      photo_price: body.photoPrice ?? 25.0,
      notes: body.notes ?? null
    }
  )
  const created = dbGet<any>('SELECT id, title, start_date as startDate, end_date as endDate, school, contact, phone, commission, photo_price as photoPrice, notes, participants_count as participantsCount, status FROM events WHERE id = ?', id)
  return NextResponse.json(created)
}


