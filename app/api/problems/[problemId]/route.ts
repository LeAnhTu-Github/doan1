import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Problem } from "@prisma/client";

export async function GET(
  request: Request,
  { params }: { params: { problemId: string } }
) {
  try {
    const { problemId } = params;

    if (!problemId) {
      return NextResponse.json(
        { error: "Missing problemId parameter" },
        { status: 400 }
      );
    }

    const problem = await db.problem.findUnique({
      where: { id: problemId },
      include: {
        testCases: true,
        contestProblems: true,
        submissions: true,
      },
    });

    if (!problem) {
      return NextResponse.json(
        { error: "Problem not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(problem, { status: 200 });
  } catch (error) {
    console.error("Error fetching problem:", error);
    return NextResponse.json(
      { error: "Failed to fetch problem" },
      { status: 500 }
    );
  }
}
