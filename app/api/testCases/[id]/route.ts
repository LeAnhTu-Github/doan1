import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET: Lấy test case theo ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Missing test case ID" },
        { status: 400 }
      );
    }

    const testCase = await db.testCase.findUnique({
      where: { id },
      include: {
        problem: true, // Bao gồm thông tin problem liên quan
      },
    });

    if (!testCase) {
      return NextResponse.json(
        { error: "Test case not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(testCase, { status: 200 });
  } catch (error) {
    console.error("Error fetching test case:", error);
    return NextResponse.json(
      { error: "Failed to fetch test case" },
      { status: 500 }
    );
  }
}

// PUT: Cập nhật test case
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Missing test case ID" },
        { status: 400 }
      );
    }

    const testCase = await db.testCase.update({
      where: { id },
      data: {
        input: body.input,
        expected: body.expected,
        isHidden: body.isHidden,
        problemId: body.problemId, // Có thể cập nhật problemId nếu cần
      },
    });

    return NextResponse.json(testCase, { status: 200 });
  } catch (error) {
    console.error("Error updating test case:", error);
    return NextResponse.json(
      { error: "Failed to update test case" },
      { status: 500 }
    );
  }
}

// DELETE: Xóa test case
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Missing test case ID" },
        { status: 400 }
      );
    }

    await db.testCase.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Test case deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting test case:", error);
    return NextResponse.json(
      { error: "Failed to delete test case" },
      { status: 500 }
    );
  }
}