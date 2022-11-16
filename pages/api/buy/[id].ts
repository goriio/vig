import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { getSession } from 'next-auth/react';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const virtualItemId = req.query.id as string;
  const session = await getSession({ req });
  const { referenceNo } = req.body;

  switch (req.method) {
    case 'POST': {
      await prisma.virtualItem.update({
        where: {
          id: virtualItemId,
        },
        data: {
          inMarket: false,
          bought: true,
        },
      });

      const result = await prisma.sale.create({
        data: {
          referenceNo,
          virtualItem: {
            connect: {
              id: virtualItemId,
            },
          },
          buyer: {
            connect: {
              email: session?.user?.email!,
            },
          },
        },
      });
      console.log(result);
      return res.send(result);
    }

    default: {
      res.status(403).end();
    }
  }
}
