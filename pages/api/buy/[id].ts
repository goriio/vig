import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { getSession } from 'next-auth/react';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  const virtualItemId = req.query.id as string;
  const { referenceNo } = req.body;

  switch (req.method) {
    case 'POST': {
      try {
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

        await prisma.virtualItem.update({
          where: {
            id: virtualItemId,
          },
          data: {
            inMarket: false,
            bought: true,
          },
        });

        return res.send(result);
      } catch {
        return res.status(500).send({ error: 'Something went wrong' });
      }
    }

    default: {
      res.status(403).end();
    }
  }
}
