import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/lib/prisma';
import { NextApiHandler } from 'next';

const authHandler: NextApiHandler = (req, res) =>
  NextAuth(req, res, {
    providers: [
      DiscordProvider({
        clientId: process.env.DISCORD_CLIENT_ID as string,
        clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
      }),
    ],
    adapter: PrismaAdapter(prisma),
    // secret: process.env.SECRET,
    pages: {
      signIn: '/login',
    },
  });

export default authHandler;
