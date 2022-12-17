import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { getSession } from 'next-auth/react';
import { User } from '@prisma/client';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  const { name, email, image }: User = req.body;

  switch (req.method) {
    case 'PUT': {
      try {
        await prisma.user.update({
          where: {
            email: session?.user?.email as string,
          },
          data: {
            name,
            email,
            image,
          },
        });
      } catch {
        return res.status(500).send({ error: 'Something went wrong' });
      }
    }
    case 'DELETE': {
      try {
        await prisma.user.delete({
          where: {
            email: session?.user?.email as string,
          },
        });
      } catch {
        return res.status(500).send({ error: 'Something went wrong' });
      }
    }
    default: {
      res.status(403).send({ error: 'Method not allowed' });
    }
  }
}
