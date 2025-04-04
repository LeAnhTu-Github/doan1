import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// Lấy danh sách cuộc thi
export async function GET() {
  try {
    // Lấy 3 cuộc thi công khai, đang diễn ra (status: "ongoing")
    const publicContests = await db.contest.findMany({
      where: {
        isPublic: true,
        status: "upcoming", // Chỉ lấy các cuộc thi đang diễn ra
      },
      orderBy: {
        startTime: "desc", // Sắp xếp theo thời gian bắt đầu giảm dần
      },
      take: 3, // Lấy 3 cuộc thi
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


    // Trả về cả hai danh sách
    return NextResponse.json({ publicContests }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch contests', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Tạo một cuộc thi mới (giữ nguyên logic POST của bạn)
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