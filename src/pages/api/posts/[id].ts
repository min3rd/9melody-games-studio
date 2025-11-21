import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  if (req.method === 'GET') {
    const post = await prisma.post.findUnique({ where: { id: Number(id) } })
    if (!post) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND' } })
    return res.status(200).json({ success: true, data: post })
  }

  if (req.method === 'DELETE') {
    try {
      const post = await prisma.post.delete({ where: { id: Number(id) } })
      return res.status(200).json({ success: true, data: post })
    } catch (e) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND' } })
    }
  }

  res.setHeader('Allow', ['GET', 'DELETE'])
  return res.status(405).json({ success: false, error: { code: 'METHOD_NOT_ALLOWED' } })
}
