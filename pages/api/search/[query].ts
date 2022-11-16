import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const query = req.query.query as string;

  switch (req.method) {
    case 'GET': {
      const result = await prisma.virtualItem.findMany({
        where: {
          name: {
            contains: query,
            mode: 'insensitive',
          },
        },
        include: {
          owner: true,
        },
      });
      return res.send(result);
    }
    default: {
      res.status(403).end();
    }
  }
}
