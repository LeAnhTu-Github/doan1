import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: { contestId: string } }
) {
  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();

  // Set up interval to send updates every minute
  const interval = setInterval(async () => {
    try {
      const contest = await db.contest.findUnique({
        where: { id: params.contestId },
        include: {
          problems: {
            include: {
              problem: true
            }
          },
          participants: {
            include: {
              user: true
            }
          },
          submissions: {
            include: {
              user: true,
              problem: true
            },
            orderBy: {
              submittedAt: 'desc'
            }
          },
          _count: {
            select: {
              participants: true,
              problems: true,
              submissions: true
            }
          }
        }
      });

      if (contest) {
        await writer.write(encoder.encode(`data: ${JSON.stringify(contest)}\n\n`));
      }
    } catch (error) {
      console.error('Error fetching contest data:', error);
    }
  }, 60000); // Update every minute

  // Clean up interval when client disconnects
  req.signal.addEventListener('abort', () => {
    clearInterval(interval);
    writer.close();
  });

  return new NextResponse(responseStream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
} 