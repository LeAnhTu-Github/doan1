import { WebSocketServer, WebSocket } from 'ws';
import { db } from './db';

const wss = new WebSocketServer({ port: 3001 });

wss.on('connection', (ws: WebSocket) => {
  console.log('New client connected');

  ws.on('message', async (message: string) => {
    try {
      const data = JSON.parse(message.toString());
      
      if (data.type === 'subscribe') {
        const { contestId } = data;
        
        // Set up interval to send updates every minute
        const interval = setInterval(async () => {
          const contest = await db.contest.findUnique({
            where: { id: contestId },
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
            ws.send(JSON.stringify({
              type: 'update',
              data: contest
            }));
          }
        }, 60000); // Update every minute

        // Clean up interval when client disconnects
        ws.on('close', () => {
          clearInterval(interval);
        });
      }
    } catch (error) {
      console.error('WebSocket error:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

export { wss }; 