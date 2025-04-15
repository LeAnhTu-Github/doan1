import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

// Lấy chi tiết một cuộc thi
export async function GET(request: Request, { params }: { params: { contestId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch contest with problems
    const contest = await db.contest.findUnique({
      where: {
        id: params.contestId,
      },
      include: {
        problems: {
          include: {
            problem: true,
          }
        },
        participants: true,
        submissions: true,
      },
    });

    if (!contest) {
      return new NextResponse("Contest not found", { status: 404 });
    }

    // Fetch user's submissions for this contest
    const submissions = await db.submission.findMany({
      where: {
        contestId: params.contestId,
        userId: userId,
      },
      orderBy: {
        submittedAt: 'desc'
      },
      distinct: ['problemId'],
    });

    // Check if user has completed all problems
    const isCompleted = submissions.length === contest.problems.length;
    
    // Calculate total score if completed
    const userScore = isCompleted 
      ? submissions.reduce((total, sub) => total + (sub.score || 0), 0)
      : 0;

    // Đếm số lượng participants và submissions
    const participantCount = contest.participants.length;
    const submissionCount = await db.submission.count({
      where: {
        contestId: params.contestId,
      }
    });

    return NextResponse.json({
      ...contest,
      isCompleted,
      userScore,
      participantCount, // Số lượng người tham gia
      submissionCount,  // Tổng số bài nộp
    });

  } catch (error) {
    console.error("[CONTEST_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
// Cập nhật một cuộc thi
export async function PUT(
  req: Request,
  { params }: { params: { contestId: string } }
) {
  try {
    const body = await req.json();
    const { 
      title, 
      description, 
      startTime, 
      duration, 
      status, 
      isPublic, 
      joinCode, 
      problemIds,
      imageUrl
    } = body;

    const updatedContest = await db.contest.update({
      where: {
        id: params.contestId,
      },
      data: {
        title,
        description,
        imageUrl,
        startTime: new Date(startTime),
        duration,
        status,
        isPublic,
        joinCode,
        problems: {
          deleteMany: {},
          create: problemIds.map((id: string) => ({
            problemId: id,
          })),
        },
      },
    });

    return NextResponse.json(updatedContest);
  } catch (error) {
    console.log("[CONTEST_ID_UPDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// API endpoint để kích hoạt/hủy kích hoạt cuộc thi
export async function PATCH(request: Request, { params }: { params: { contestId: string } }) {
  try {
    const body = await request.json();
    const { isActive } = body;

    // Nếu đang hủy kích hoạt, tự động nộp bài cho tất cả người dùng đang làm bài
    if (!isActive) {
      // Lấy danh sách người dùng đang làm bài
      const activeParticipants = await db.contestParticipant.findMany({
        where: {
          contestId: params.contestId,
          finishedAt: null,
        },
      });

      // Cập nhật thời gian kết thúc cho tất cả người dùng
      await Promise.all(
        activeParticipants.map(participant =>
          db.contestParticipant.update({
            where: {
              id: participant.id,
            },
            data: {
              finishedAt: new Date(),
            },
          })
        )
      );
    }

    const contest = await db.contest.update({
      where: { id: params.contestId },
      data: {
        isActive,
      },
    });

    return NextResponse.json(contest, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update contest status', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Xóa một cuộc thi
export async function DELETE(request: Request, { params }: { params: { contestId: string } }) {
  try {
    await db.contest.delete({
      where: { id: params.contestId },
    });

    return NextResponse.json({ message: 'Contest deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete contest', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}