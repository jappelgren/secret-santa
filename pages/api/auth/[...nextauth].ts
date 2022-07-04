import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import fs from 'fs';
import { IAdminData } from '../../../models';
import bcrypt from 'bcrypt';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const userHex: any = fs.readFileSync(`./models/adminData/admin.json`);
        const user: IAdminData = JSON.parse(userHex);
        if (
          typeof credentials?.password === 'undefined' ||
          typeof credentials.username === 'undefined'
        )
          return null;

        const passMatches = bcrypt.compareSync(
          credentials.password,
          user.password
        );

        console.log(passMatches);
        if (
          credentials.username.toLocaleLowerCase() ===
            user.userName.toLocaleLowerCase() &&
          passMatches
        ) {
          return user;
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
