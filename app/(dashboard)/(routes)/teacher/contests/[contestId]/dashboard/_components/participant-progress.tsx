"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

const ProgressTable = ({ 
  participants,
  problems,
  submissions,
  limit
}: ParticipantProgressProps & { limit?: number }) => {
  // Helper function to find the submission with highest score for a participant and problem
  const findBestSubmission = (participantUserId: string, problemId: string) => {
    return submissions
      .filter(s => s.user.id === participantUserId && s.problemId === problemId)
      .sort((a, b) => (b.score || 0) - (a.score || 0))[0];
  };

  // Calculate earliest submission time and best score for each participant
  const participantsWithStats = participants.map(participant => {
    const bestSubmissions = problems.map(problem => 
      findBestSubmission(participant.user.id, problem.problemId)
    ).filter(Boolean);

    const totalScore = bestSubmissions.reduce((sum, sub) => sum + (sub?.score || 0), 0);
    const earliestSubmission = bestSubmissions
      .sort((a, b) => new Date(a!.submittedAt).getTime() - new Date(b!.submittedAt).getTime())[0];

    return {
      participant,
      totalScore,
      earliestSubmissionTime: earliestSubmission ? new Date(earliestSubmission.submittedAt).getTime() : Infinity
    };
  });

  // Sort participants by total score (desc) and then by earliest submission time
  const sortedParticipants = participantsWithStats
    .sort((a, b) => {
      if (b.totalScore !== a.totalScore) {
        return b.totalScore - a.totalScore;
      }
      return a.earliestSubmissionTime - b.earliestSubmissionTime;
    })
    .map(p => p.participant);

  // Take limited number of participants if limit is specified
  const displayParticipants = limit ? sortedParticipants.slice(0, limit) : sortedParticipants;

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50">
          <TableHead className="w-[50px] text-center">STT</TableHead>
          <TableHead className="w-[200px]">Thí sinh</TableHead>
          {problems.map((_, index) => (
            <TableHead key={index} className="text-center w-[120px]">
              <div className="flex flex-col items-center gap-1">
                <span>Bài {index + 1}</span>
                <span className="text-xs text-muted-foreground">(100đ)</span>
              </div>
            </TableHead>
          ))}
          <TableHead className="text-center w-[100px]">
            <div className="flex flex-col items-center gap-1">
              <span>Tổng điểm</span>
              <span className="text-xs text-muted-foreground">({problems.length * 100}đ)</span>
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {displayParticipants.map((participant, index) => {
          const problemScores = problems.map(problem => 
            findBestSubmission(participant.user.id, problem.problemId)
          );
          
          const totalScore = problemScores.reduce((sum, sub) => sum + (sub?.score || 0), 0);

          return (
            <TableRow key={participant.id}>
              <TableCell className="text-center text-muted-foreground">
                {index + 1}
              </TableCell>
              <TableCell className="font-medium">{participant.user.name}</TableCell>
              {problemScores.map((submission, idx) => (
                <TableCell key={`${participant.id}-${idx}`} className="text-center p-2">
                  {submission ? (
                    <div className="flex flex-col items-center gap-1">
                      <span className={`text-sm font-medium ${submission.score === 100 ? 'text-green-600' : 'text-orange-500'}`}>
                        {submission.score}đ
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(submission.submittedAt), 'HH:mm:ss', { locale: vi })}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
              ))}
              <TableCell className="text-center font-semibold">
                {totalScore}đ
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export const ParticipantProgress = (props: ParticipantProgressProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hasSubmissions = props.submissions.length > 0;

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          Bảng xếp hạng
          {hasSubmissions && <span className="text-sm text-muted-foreground ml-2">(Sắp xếp theo điểm số và thời gian nộp)</span>}
        </h2>
        {props.participants.length > 10 && (
          <Button 
            variant="outline"
            onClick={() => setIsModalOpen(true)}
          >
            Xem tất cả ({props.participants.length})
          </Button>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <ProgressTable {...props} limit={10} />
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Bảng xếp hạng tất cả thí sinh
              {hasSubmissions && <span className="text-sm text-muted-foreground ml-2">(Sắp xếp theo điểm số và thời gian nộp)</span>}
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-x-auto mt-4">
            <ProgressTable {...props} />
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};