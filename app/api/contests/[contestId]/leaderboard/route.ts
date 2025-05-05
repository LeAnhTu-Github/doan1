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

    // Lấy danh sách participant
    const participants = await db.contestParticipant.findMany({
      where: { contestId },
      include: {
        user: { select: { id: true, name: true, masv: true } },
      },
    });

    // Lấy submission cuối cùng của mỗi user trong contest
    const submissions = await db.submission.findMany({
      where: { contestId },
      orderBy: [{ userId: "asc" }, { submittedAt: "desc" }],
    });

    // Map userId -> submission cuối cùng
    const lastSubmissionMap: Record<string, Date | null> = {};
    submissions.forEach((sub) => {
      if (!sub.userId) return;
      const userId = String(sub.userId);
      if (!lastSubmissionMap[userId]) {
        lastSubmissionMap[userId] = sub.submittedAt;
      }
    });

    // Format leaderboard data
    const formattedLeaderboard = participants.map((entry, index) => {
      const userId = entry.user?.id ? String(entry.user.id) : 'unknown';
      return {
        userId,
        name: entry.user?.name || 'Ẩn danh',
        masv: entry.user?.masv || 'N/A',
        score: entry.score,
        rank: index + 1,
        submissionTime: lastSubmissionMap[userId] || null,
      };
    });

    // Sắp xếp lại theo score và submissionTime
    formattedLeaderboard.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (!a.submissionTime) return 1;
      if (!b.submissionTime) return -1;
      return new Date(a.submissionTime).getTime() - new Date(b.submissionTime).getTime();
    });

    return NextResponse.json(formattedLeaderboard);
  } catch (error) {
    console.error("[LEADERBOARD_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}