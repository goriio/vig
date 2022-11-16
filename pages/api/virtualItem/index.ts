import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { getSession } from 'next-auth/react';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, price, image, gcash } = req.body;

  const session = await getSession({ req });

  switch (req.method) {
    case 'POST': {
      const result = await prisma.virtualItem.create({
        data: {
          name,
          price,
          image,
          gcash,
          owner: {
            connect: {
              email: session?.user?.email!,
            },
          },
        },
      });
      return res.send(result);
    }
    case 'GET': {
      const result = await prisma.virtualItem.findMany();
      return res.send(result);
    }
    default: {
      res.status(403).end();
    }
  }
}
