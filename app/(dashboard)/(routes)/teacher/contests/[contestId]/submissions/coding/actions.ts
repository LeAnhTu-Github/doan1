import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export async function getSubmissions(contestId: string) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/");
  }

  const submissions = await db.submission.findMany({
    where: {
      contestId: contestId
    },
    include: {
      user: {
        select: {
          name: true
        }
      },
      problem: {
        select: {
          title: true
        }
      }
    },
    orderBy: {
      submittedAt: 'desc'
    }
  });

  return submissions;
}