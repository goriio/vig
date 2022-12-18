import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import CredentialsProvider from 'next-auth/providers/credentials';
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
      CredentialsProvider({
        id: 'credentials',
        name: 'credentials',
        credentials: {
          email: {
            label: 'Email',
            type: 'email',
          },
          password: {
            label: 'Password',
            type: 'password',
          },
        },
        async authorize(credentials) {
          const res = await fetch(`${process.env.NEXTAUTH_URL}/api/authorize`, {
            method: 'POST',
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });

          if (res.ok) {
            const user = await res.json();
            return user;
          }

          return Promise.reject(new Error('Invalid credentials'));
        },
      }),
    ],
    adapter: PrismaAdapter(prisma),
    // secret: process.env.SECRET,
    pages: {
      signIn: '/login',
    },
    session: {
      strategy: 'jwt',
    },
  });

export default authHandler;
