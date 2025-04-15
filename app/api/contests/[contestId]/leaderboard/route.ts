// app/api/contests/[contestId]/leaderboard/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { contestId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const contestId = params.contestId;

    // Fetch contest participants with user information
    const leaderboard = await db.contestParticipant.findMany({
      where: {
        contestId: contestId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            masv: true,
          },
        },
      },
      orderBy: [
        { score: 'desc' },
        { finishedAt: 'asc' } // Sắp xếp theo thời gian nộp sớm nhất nếu điểm bằng nhau
      ],
    });

    // Format leaderboard data
    const formattedLeaderboard = leaderboard.map((entry, index) => ({
      userId: entry.user?.id || 'unknown',
      name: entry.user?.name || 'Ẩn danh',
      masv: entry.user?.masv || 'N/A',
      score: entry.score,
      rank: index + 1,
      submissionTime: entry.finishedAt?.toLocaleString('vi-VN'),
    }));

    return NextResponse.json(formattedLeaderboard);
  } catch (error) {
    console.error("[LEADERBOARD_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}