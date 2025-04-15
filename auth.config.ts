import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";

export const authConfig: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/sign-in",
    newUser: "/sign-up",
  },
  providers: [], // sẽ được thêm trong auth.ts
  secret: process.env.NEXTAUTH_SECRET,
};