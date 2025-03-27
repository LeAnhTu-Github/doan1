import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// Lấy danh sách cuộc thi
export async function GET() {
  try {
    const contests = await db.contest.findMany({
      include: {
        problems: {
          include: {
            problem: true, // Lấy thông tin chi tiết của problem
          },
        },
        participants: {
          include: {
            user: true, // Lấy thông tin user tham gia
          },
        },
        submissions: true, // Lấy danh sách bài nộp
      },
    });
    return NextResponse.json(contests, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch contests', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Tạo một cuộc thi mới
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, startTime, endTime, problemIds } = body;

    // Kiểm tra dữ liệu đầu vào
    if (!title || !startTime || !endTime || !problemIds || !Array.isArray(problemIds)) {
      return NextResponse.json({ error: 'Missing or invalid required fields' }, { status: 400 });
    }

    // Tạo cuộc thi mới
    const contest = await db.contest.create({
      data: {
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        problems: {
          create: problemIds.map((problemId: string) => ({
            problemId,
          })),
        },
      },
      include: {
        problems: {
          include: {
            problem: true,
          },
        },
      },
    });

    return NextResponse.json(contest, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create contest', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}