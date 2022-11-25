import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const virtualItemId = req.query.id as string;
  const { inMarket } = req.body;

  switch (req.method) {
    case 'DELETE': {
      const result = await prisma.virtualItem.delete({
        where: {
          id: virtualItemId,
        },
      });
      return res.send(result);
    }
    default: {
      res.status(403).end();
    }
  }
}
