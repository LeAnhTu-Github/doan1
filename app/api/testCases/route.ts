import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET: Lấy tất cả test cases hoặc theo problemId
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const problemId = searchParams.get("problemId");

        const testCases = await db.testCase.findMany({
            where: {
                ...(problemId && { problemId }), // Lọc theo problemId nếu có
            },
            include: {
                problem: true, // Bao gồm thông tin problem liên quan
            },
        });

        return NextResponse.json(testCases, { status: 200 });
    } catch (error) {
        console.error("Error fetching test cases:", error);
        return NextResponse.json(
            { error: "Failed to fetch test cases" },
            { status: 500 }
        );
    }
}

// POST: Tạo test case mới
export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Kiểm tra các trường bắt buộc
        if (!body.problemId || !body.input || !body.expected) {
            return NextResponse.json(
                { error: "Missing required fields: problemId, input, or expected" },
                { status: 400 }
            );
        }

        const testCase = await db.testCase.create({
            data: {
                problemId: body.problemId,
                input: body.input,
                expected: body.expected,
                isHidden: body.isHidden ?? false, // Mặc định là false nếu không cung cấp
            },
        });

        return NextResponse.json(testCase, { status: 201 });
    } catch (error) {
        console.error("Error creating test case:", error);
        return NextResponse.json(
            { error: "Failed to create test case" },
            { status: 500 }
        );
    }
}