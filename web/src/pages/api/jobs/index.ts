import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const jobs = await prisma.job.findMany({ where: { isPublished: true }, orderBy: { createdAt: 'desc' } });
    res.status(200).json({ success: true, data: jobs });
  } catch (e) {
    res.status(500).json({ success: false, error: { message: 'Server error' } });
  }
}
