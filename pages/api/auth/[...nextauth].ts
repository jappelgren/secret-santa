import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { IAdminData } from '../../../models';
import bcrypt from 'bcrypt';
import Redis from 'ioredis';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (
          typeof credentials?.password === 'undefined' ||
          typeof credentials.username === 'undefined'
        )
          return null;

        const redisUrl: string = process.env.REDIS_URL || '';
        if (redisUrl === '')
          throw new Error('REDIS_URL variable not set in environment.');

        const redis = new Redis(redisUrl);
        const redisRes = await redis.get('admin');
        const admin: IAdminData =
          redisRes && redisRes?.length > 0 ? JSON.parse(redisRes) : {};

        const passMatches = bcrypt.compareSync(
          credentials.password,
          admin.password
        );

        if (
          credentials.username.toLocaleLowerCase() ===
            admin.userName.toLocaleLowerCase() &&
          passMatches
        ) {
          return admin;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      return `${baseUrl}/admin-panel`;
    },
  },
  pages: {
    signIn: '/admin-login',
  },
  theme: {
    colorScheme: 'light',
    brandColor: '#37A34A',
    logo: '/images/holigabe_wreath.png',
  },
});
