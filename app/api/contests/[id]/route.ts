import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// Lấy chi tiết một cuộc thi
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const contest = await db.contest.findUnique({
      where: { id: params.id },
      include: {
        problems: {
          include: {
            problem: true,
          },
        },
        participants: {
          include: {
            user: true,
          },
        },
        submissions: true,
      },
    });

    if (!contest) {
      return NextResponse.json({ error: 'Contest not found' }, { status: 404 });
    }

    return NextResponse.json(contest, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch contest', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Cập nhật một cuộc thi
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { title, description, startTime, endTime, problemIds } = body;

    const contest = await db.contest.update({
      where: { id: params.id },
      data: {
        title,
        description,
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
        problems: problemIds
          ? {
              deleteMany: {}, 
              create: problemIds.map((problemId: string) => ({
                problemId,
              })),
            }
          : undefined,
      },
      include: {
        problems: {
          include: {
            problem: true,
          },
        },
      },
    });

    return NextResponse.json(contest, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update contest', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Xóa một cuộc thi
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await db.contest.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Contest deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete contest', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}