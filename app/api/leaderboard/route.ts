import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const leaderboard = await db.userRanking.findMany({
      orderBy: {
        totalScore: 'desc'
      },
      include: {
        user: true
      },
      take: 100 // Limit to top 100 users
    });

    // Calculate ranks
    const rankedLeaderboard = leaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));

    return NextResponse.json({
      leaderboard: rankedLeaderboard
    });
  } catch (error) {
    console.error("[LEADERBOARD_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 