import { Sale, VirtualItem } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const sale = req.body as Sale & { virtualItem: VirtualItem };

  await prisma.sale.update({
    where: {
      id: sale.id,
    },
    data: {
      approvedAt: new Date(),
    },
  });

  res.status(200).end();
}
