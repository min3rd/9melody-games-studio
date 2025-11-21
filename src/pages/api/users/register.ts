import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: { code: 'METHOD_NOT_ALLOWED' } })

  const { email, name, password } = req.body
  if (!email || !name || !password) return res.status(400).json({ success: false, error: { code: 'BAD_PAYLOAD', message: 'Missing fields' } })

  const hashed = await bcrypt.hash(password, 10)
  try {
    const user = await prisma.user.create({ data: { email, name, password: hashed } })
    const safeUser = { id: user.id, email: user.email, name: user.name }
    res.status(201).json({ success: true, data: safeUser })
  } catch (e: any) {
    if (e.code === 'P2002') return res.status(409).json({ success: false, error: { code: 'DUPLICATE', message: 'Email already exists' } })
    console.error(e)
    res.status(500).json({ success: false, error: { code: 'INTERNAL', message: 'Unexpected error' } })
  }
}
