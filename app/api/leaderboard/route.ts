import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Parse and return the time range (start, end) based on the filter.
 * @param filter "all" | "day" | "week" | "month"
 */
function getTimeRange(filter: string) {
  const now = new Date();
  let start: Date | undefined = undefined;
  let end: Date | undefined = undefined;

  switch (filter) {
    case "day":
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      break;
    case "week": {
      const day = now.getDay() || 7;
      start = new Date(now);
      start.setHours(0, 0, 0, 0);
      start.setDate(now.getDate() - day + 1);
      end = new Date(start);
      end.setDate(start.getDate() + 7);
      break;
    }
    case "month":
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      break;
    default:
      // "all"
      break;
  }
  return { start, end };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const timeFilter = searchParams.get("timeFilter") || "all";
    const searchTerm = searchParams.get("searchTerm")?.toLowerCase() || "";

    const { start, end } = getTimeRange(timeFilter);

    // Build where clause
    const where: any = {};

    // Filter by time if needed (assume you have a "updatedAt" or "createdAt" field)
    if (start && end) {
      where.updatedAt = {
        gte: start,
        lt: end,
      };
    }

    // Filter by search term (name or masv)
    if (searchTerm) {
      where.OR = [
        { user: { name: { contains: searchTerm, mode: "insensitive" } } },
        { user: { masv: { contains: searchTerm, mode: "insensitive" } } },
      ];
    }

    const leaderboard = await db.userRanking.findMany({
      where,
      orderBy: {
        totalScore: "desc",
      },
      include: {
        user: true,
      },
      take: 100, // Limit to top 100 users
    });

    // Calculate ranks
    const rankedLeaderboard = leaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

    return NextResponse.json({
      leaderboard: rankedLeaderboard,
    });
  } catch (error) {
    console.error("[LEADERBOARD_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 