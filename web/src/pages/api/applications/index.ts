import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { jobId, name, email, resumeUrl, message } = req.body;

    if (!jobId || !name || !email) {
      return res.status(400).json({ success: false, error: { message: 'Missing required fields' } });
    }

    try {
      const application = await prisma.application.create({ data: { jobId, name, email, resumeUrl, message } });
      return res.status(201).json({ success: true, data: application });
    } catch (e) {
      return res.status(500).json({ success: false, error: { message: 'Server error' } });
    }
  }

  if (req.method === 'GET') {
    // TODO: add auth & role checks
    const applications = await prisma.application.findMany({ orderBy: { createdAt: 'desc' } });
    return res.status(200).json({ success: true, data: applications });
  }

  return res.status(405).end();
}
