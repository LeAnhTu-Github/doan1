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
import { ContestParticipant, ContestProblem, Problem, User } from "@prisma/client";

interface ParticipantProgressProps {
  participants: (ContestParticipant & {
    user: User;
  })[];
  problems: (ContestProblem & {
    problem: Problem;
  })[];
}

export const ParticipantProgress = ({
  participants,
  problems
}: ParticipantProgressProps) => {
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
                {problems.map((problem) => (
                  <TableCell key={problem.problemId} className="text-center">
                    {/* Hiển thị trạng thái bài làm */}
                    ⏳
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};