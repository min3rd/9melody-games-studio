import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const posts = await prisma.post.findMany({ where: { published: true }, take: 10, orderBy: { createdAt: 'desc' } });
    res.status(200).json({ success: true, data: posts });
  } catch (e) {
    res.status(500).json({ success: false, error: { message: 'Server error' } });
  }
}
