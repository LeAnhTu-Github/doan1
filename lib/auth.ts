import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";

// Mở rộng kiểu dữ liệu cho session
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string | null;
      email: string | null;
      role: string | null;
      imageUrl: string | null;
    }
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image || null, // Sử dụng image thay vì imageUrl
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await db.user.upsert({
          where: { email: user.email || '' },
          update: {
            name: user.name,
            image: user.image ? user.image : null, // Lưu trường image từ Google
          },
          create: {
            email: user.email,
            name: user.name,
            image: user.image || null, // Lưu trường image
            role: "USER",
          },
        });

        return {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          role: dbUser.role,
          image: dbUser.image || null, // Trả về image thay vì imageUrl
        };
      }

      const dbUser = await db.user.findFirst({
        where: { email: token.email },
      });

      if (dbUser) {
        return {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          role: dbUser.role,
          image: dbUser.image || null, // Sử dụng image
        };
      }

      return token;
    },
    async session({ token, session }) {
      if (token) {
        session.user = {
          id: token.id as string,
          name: token.name as string | null,
          email: token.email as string | null,
          role: token.role as string | null,
          imageUrl: token.image as string | null, // Corrected to imageUrl
        };
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Luôn redirect về trang chủ sau khi đăng nhập
      return baseUrl;
    }
  },
};