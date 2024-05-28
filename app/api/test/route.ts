
import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";

export async function POST(
  req: Request,
) {
  try {
    
    const { userId } = auth();
    
    const { testId, score }= await req.json();
    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const userProfile = await db.user.findMany({
      where: {
        id: userId, // Provide a default value of an empty string if userId is null
      },
    });
    const user = userProfile[0];
    const newScore = await db.score.create({
        data: {
          userId: userId,
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
        if (score.id !== newScore.id) {
          await db.score.update({
            where: { id: score.id },
            data: { rank: i + 2 }, // start ranking from 2 for other scores
          });
        }
      }
     

    return NextResponse.json(newScore);
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}