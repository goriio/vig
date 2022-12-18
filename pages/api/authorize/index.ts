import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { email, password } = JSON.parse(req.body);

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password as string
    );

    if (user && user.password && isPasswordCorrect) {
      return res.status(200).json(user);
    }

    return res.status(401).json({ error: 'Invalid credentials' });
  }

  return res.status(405).json({ error: `Method not allowed.` });
}
