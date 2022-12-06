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

  await prisma.sale.delete({
    where: {
      id: sale.id,
    },
  });

  await prisma.virtualItem.update({
    where: {
      id: sale.virtualItem.id,
    },
    data: {
      inMarket: true,
      bought: false,
    },
  });

  res.status(200).end();
}
