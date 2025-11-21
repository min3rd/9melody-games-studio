import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const posts = await prisma.post.findMany({ orderBy: { createdAt: 'desc' } })
    res.status(200).json({ success: true, data: posts })
    return
  }

  if (req.method === 'POST') {
    const { title, content } = req.body
    if (!title) return res.status(400).json({ success: false, error: { code: 'BAD_PAYLOAD', message: 'Missing title' } })
    const post = await prisma.post.create({ data: { title, content } })
    res.status(201).json({ success: true, data: post })
    return
  }

  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).json({ success: false, error: { code: 'METHOD_NOT_ALLOWED', message: 'Method Not Allowed' } })
}
