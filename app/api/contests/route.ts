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
    const { title, description, startTime, duration, status, isPublic, joinCode, problemIds = [], imageUrl } = body;

    // Kiểm tra dữ liệu đầu vào cơ bản
    if (!title || !startTime || !duration) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Tính thời gian kết thúc từ startTime và duration
    const start = new Date(startTime);
    const end = new Date(start.getTime() + duration * 60000); // Convert minutes to milliseconds

    // Tạo cuộc thi mới với các trường cập nhật
    const contest = await db.contest.create({
      data: {
        title,
        description,
        imageUrl,
        startTime: start,
        duration,
        status,
        isPublic,
        joinCode,
        problems: problemIds.length > 0 ? {
          create: problemIds.map((problemId: string) => ({
            problemId,
          })),
        } : undefined,
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
    console.error("Create contest error:", error);
    return NextResponse.json(
      { error: 'Failed to create contest', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}