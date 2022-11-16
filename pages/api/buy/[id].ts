import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const virtualItemId = req.query.id as string;

  switch (req.method) {
    case 'PUT': {
      const result = await prisma.virtualItem.update({
        where: {
          id: virtualItemId,
        },
        data: {
          inMarket: false,
          bought: true,
        },
      });
      return res.send(result);
    }
    default: {
      res.status(403).end();
    }
  }
}
