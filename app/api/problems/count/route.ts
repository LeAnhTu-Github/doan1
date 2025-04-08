import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // Đếm tổng số bài tập có status = true (đã được publish)
    const count = await db.problem.count({});

    return NextResponse.json({
      success: true,
      count: count
    });
  } catch (error) {
    console.error("[PROBLEM_COUNT_ERROR]", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to get problem count" 
      }, 
      { status: 500 }
    );
  }
}
