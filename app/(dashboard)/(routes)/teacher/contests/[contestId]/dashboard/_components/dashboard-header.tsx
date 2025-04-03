"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Contest } from "@prisma/client";
import { CountdownTimer } from "./countdown-timer";

interface DashboardHeaderProps {
  contest: Contest & {
    _count: {
      participants: number;
      problems: number;
      submissions: number;
    };
  };
}

export const DashboardHeader = ({
  contest
}: DashboardHeaderProps) => {
  const timeLeft = new Date(contest.endTime).getTime() - Date.now();
  const isActive = contest.status === "ongoing";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{contest.title}</h1>
        <CountdownTimer />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium">Trạng thái</div>
            <div className={`text-2xl font-bold ${
              isActive ? "text-green-600" : "text-yellow-600"
            }`}>
              {isActive ? "Đang diễn ra" : "Sắp diễn ra"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium">Số thí sinh</div>
            <div className="text-2xl font-bold">
              {contest._count.participants}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium">Tổng số bài nộp</div>
            <div className="text-2xl font-bold">
              {contest._count.submissions}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium">Thời gian còn lại</div>
            <div className="text-2xl font-bold">
              {timeLeft > 0 ? Math.floor(timeLeft / (1000 * 60)) + " phút" : "Đã kết thúc"}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};