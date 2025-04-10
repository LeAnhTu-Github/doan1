"use client";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ContestParticipant, ContestProblem, Problem, Submission, User } from "@prisma/client";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface ParticipantProgressProps {
  participants: (ContestParticipant & {
    user: User;
  })[];
  problems: (ContestProblem & {
    problem: Problem;
  })[];
  submissions: (Submission & {
    user: User;
    problem: Problem;
  })[];
}

export const ParticipantProgress = ({
  participants,
  problems,
  submissions
}: ParticipantProgressProps) => {
  // Helper function to find the earliest submission for a participant and problem
  const findSubmission = (participantUserId: string, problemId: string) => {
    return submissions.find(
      (submission) => 
        submission.user.id === participantUserId && 
        submission.problemId === problemId
    );
  };

  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">Tiến độ thí sinh</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Thí sinh</TableHead>
              {problems.map((p) => (
                <TableHead key={p.problemId} className="text-center">
                  {p.problem.title}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {participants.map((participant) => (
              <TableRow key={participant.id}>
                <TableCell>{participant.user.name}</TableCell>
                {problems.map((problem) => {
                  const submission = findSubmission(participant.user.id, problem.problemId);
                  
                  return (
                    <TableCell key={problem.problemId} className="text-center">
                      {submission ? (
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-medium">
                            {format(new Date(submission.submittedAt), 'HH:mm:ss', { locale: vi })}
                          </span>
                          <span className="text-xs text-gray-500">
                            {format(new Date(submission.submittedAt), 'dd/MM/yyyy', { locale: vi })}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">⏳</span>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};