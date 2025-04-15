"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Contest } from "@prisma/client";
import moment from "moment";
import { useEffect, useState, useCallback } from "react";
import { Timer, RefreshCw } from "lucide-react";

interface DashboardHeaderProps {
  contest: Contest;
  participantCount: number;
    submissionCount: number;
}

export const DashboardHeader = ({
  contest: initialContest,
  participantCount,
  submissionCount,
}: DashboardHeaderProps) => {
  const [contest, setContest] = useState(initialContest);
  const [timeLeft, setTimeLeft] = useState("Đang tải...");
  const [status, setStatus] = useState({
    text: "Đang tải...",
    color: "text-gray-600",
  });
  const [refreshCountdown, setRefreshCountdown] = useState(60);
  const [isLoading, setIsLoading] = useState(true);

  const fetchContestData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/contests/${contest.id}`);
      if (response.ok) {
        const updatedContest = await response.json();
        setContest(updatedContest);
        setRefreshCountdown(60);
      } else {
        console.error("API error:", response.status);
      }
    } catch (error) {
      console.error("Error fetching updated contest data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [contest.id]);

  useEffect(() => {
    fetchContestData();

    const countdownInterval = setInterval(() => {
      setRefreshCountdown((prev) => {
        if (prev <= 1) {
          fetchContestData();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [fetchContestData]);

  useEffect(() => {
    const updateTimeAndStatus = () => {
      const now = moment();
      const contestStart = moment(contest.startTime);
      const contestEnd = moment(contest.startTime).add(
        contest.duration,
        "minutes"
      );

      if (now.isAfter(contestEnd)) {
        setStatus({
          text: "Đã kết thúc",
          color: "text-red-600",
        });
        setTimeLeft("Đã kết thúc");
      } else if (!contest.isActive || now.isBefore(contestStart)) {
        setStatus({
          text: "Sắp diễn ra",
          color: "text-yellow-600",
        });
        setTimeLeft("Chưa bắt đầu");
      } else {
        setStatus({
          text: "Đang diễn ra",
          color: "text-green-600",
        });

        const duration = moment.duration(contestEnd.diff(now));
        const hours = Math.floor(duration.asHours());
        const minutes = duration.minutes();
        const seconds = duration.seconds();

        if (hours > 0) {
          setTimeLeft(`${hours} giờ ${minutes} phút`);
        } else if (minutes > 0) {
          setTimeLeft(`${minutes} phút ${seconds} giây`);
        } else {
          setTimeLeft(`${seconds} giây`);
        }
      }
    };

    updateTimeAndStatus();
    const interval = setInterval(updateTimeAndStatus, 1000);

    return () => clearInterval(interval);
  }, [contest.startTime, contest.duration, contest.isActive]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{contest.title}</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <RefreshCw className="w-4 h-4" />
          <span>Cập nhật sau: {refreshCountdown}s</span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium">Trạng thái</div>
            <div className={`text-2xl font-bold ${status.color}`}>
              {status.text}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium">Số thí sinh</div>
            <div className="text-2xl font-bold">
              {isLoading ? "Đang tải..." : (participantCount ?? 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium">Tổng số bài nộp</div>
            <div className="text-2xl font-bold">
              {isLoading ? "Đang tải..." : (submissionCount ?? 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col">
            <div className="text-sm font-medium flex items-center gap-2">
              <Timer className="w-4 h-4" />
              Thời gian còn lại
            </div>
            <div className="text-2xl font-bold text-blue-600">{timeLeft}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};