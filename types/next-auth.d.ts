import NextAuth from "next-auth";
import { ContestParticipant, User } from "@prisma/client";
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

export type ParticipantWithUser = ContestParticipant & {
  user: User | null;
};