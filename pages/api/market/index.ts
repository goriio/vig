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
      let result;
      if (session) {
        result = await prisma.virtualItem.findMany({
          where: {
            bought: false,
            NOT: {
              owner: {
                email: session?.user?.email,
              },
            },
          },
          include: {
            owner: true,
          },
        });
      } else {
        result = await prisma.virtualItem.findMany({
          include: {
            owner: true,
          },
        });
      }
      return res.send(result);
    }
    default: {
      res.status(403).end();
    }
  }
}
