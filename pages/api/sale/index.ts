import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { getSession } from 'next-auth/react';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  switch (req.method) {
    case 'GET': {
      const result = await prisma.sale.findMany({
        where: {
          virtualItem: {
            owner: {
              email: session?.user?.email,
            },
            bought: true,
          },
        },
      });
      return res.send(result);
    }
    default: {
      res.status(403).end();
    }
  }
}
