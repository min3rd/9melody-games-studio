import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@lib/prisma';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, error: { message: 'Missing email or password' } });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ success: false, error: { message: 'Invalid credentials' } });

  const ok = bcrypt.compareSync(password, user.password);
  if (!ok) return res.status(401).json({ success: false, error: { message: 'Invalid credentials' } });

  // NOTE: For production, issue a secure HTTPOnly cookie or JWT
  return res.status(200).json({ success: true, data: { id: user.id, email: user.email, name: user.name } });
}
