import { NextResponse } from 'next/server'
import { dbGet } from '@/lib/sqlite'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    if (!email || !password) {
      return NextResponse.json({ message: 'Credenciais inválidas' }, { status: 400 })
    }

    const user = dbGet<{ id: string; email: string; name: string; password: string }>(
      'SELECT id, email, name, password FROM users WHERE email = ?',
      email
    )

    if (!user || user.password !== password) {
      return NextResponse.json({ message: 'Credenciais inválidas' }, { status: 401 })
    }

    return NextResponse.json({ id: user.id, email: user.email, name: user.name || user.email })
  } catch (error) {
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 })
  }
}


