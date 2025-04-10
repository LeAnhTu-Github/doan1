
import { auth, currentUser } from "import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";

export async function POST(
  req: Request,
) {
  try {
    
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    
    const { testId, score }= await req.json();
    // if (!userId || !isTeacher(userId)) {
    //   return new NextResponse("Unauthorized", { status: 401 });
    // }
    const userProfile = await db.user.findMany({
      where: {
        id: userId!, // Provide a default value of an empty string if userId is null
      },
    });
    const user = userProfile[0];
    const newScore = await db.score.create({
        data: {
          userId: userId!,
          testId: testId,
          masv: user.masv,
          name: user.name,
          class: user.class,
          score: score,
          rank: 1,
          createdAt: new Date(),
        },
      });
     // Get all scores, sorted by score and createdAt
     // Get all scores, sorted by score and createdAt
const scores = await db.score.findMany({
  orderBy: [
    {
      score: 'desc',
    },
    {
      createdAt: 'asc',
    },
  ],
});

// Calculate rank for each score
for (let i = 0; i < scores.length; i++) {
  const score = scores[i];
  await db.score.update({
    where: { id: score.id },
    data: { rank: i + 1 }, // start ranking from 1 for the highest score
  });
}
     

    return NextResponse.json(newScore);
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}