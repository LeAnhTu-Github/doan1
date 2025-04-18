import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { DashboardHeader } from "./_components/dashboard-header";
import { ParticipantProgress } from "./_components/participant-progress";
import { ProblemStats } from "./_components/problem-stats";
import { Problem } from "@prisma/client";
import { authOptions } from "@/lib/auth";

const ContestDashboardPage = async ({
  params
}: {
  params: { contestId: string }
}) => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return redirect("/");
  }

  const contest = await db.contest.findUnique({
    where: {
      id: params.contestId
    },
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

  if (!contest) {
    return redirect("/teacher/contests");
  }

  // Filter out participants and submissions with null users
  const validParticipants = contest.participants.filter(
    (participant): participant is typeof participant & { user: NonNullable<typeof participant.user> } => 
    participant.user !== null
  );

  const validSubmissions = contest.submissions.filter(
    (submission): submission is typeof submission & { user: NonNullable<typeof submission.user> } => 
    submission.user !== null
  );

  return (
    <div className="p-6">
      <DashboardHeader 
        contest={contest} 
        participantCount={contest._count.participants} 
        submissionCount={contest._count.submissions} 
      />
      
      <div className="mt-6 grid grid-cols-1 gap-6">
      <div>
          <ProblemStats 
            problems={contest.problems}
            submissions={validSubmissions}
          />
        </div>
        <div>
          <ParticipantProgress 
            participants={validParticipants}
            problems={contest.problems}
            submissions={validSubmissions}
          />
        </div>
      </div>
    </div>
  );
};

export default ContestDashboardPage;