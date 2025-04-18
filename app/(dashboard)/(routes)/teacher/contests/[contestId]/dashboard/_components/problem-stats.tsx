"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ContestProblem, Problem, Submission, User } from "@prisma/client";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Thêm plugin animation
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ProblemStatsProps {
  problems: (ContestProblem & {
    problem: Problem;
  })[];
  submissions: (Submission & {
    user: User;
  })[];
}

interface UserScore {
  name: string;
  totalScore: number;
  problemScores: Record<string, number>;
  previousRank?: number;
  currentRank?: number;
}

const ChartComponent = ({ 
  data, 
  options, 
  height = "400px",
  previousRanks
}: { 
  data: any; 
  options: any; 
  height?: string;
  previousRanks?: Record<string, number>;
}) => {
  const chartRef = useRef<any>(null);

  // Thêm hiệu ứng cho label khi thay đổi thứ hạng
  const getRankChangeClass = (userName: string) => {
    if (!previousRanks || !previousRanks[userName]) return "";
    const currentRank = data.labels.indexOf(userName);
    const previousRank = previousRanks[userName];
    
    if (currentRank < previousRank) return "rank-up";
    if (currentRank > previousRank) return "rank-down";
    return "";
  };

  useEffect(() => {
    if (chartRef.current) {
      // Thêm animation cho mỗi bar
      data.labels.forEach((label: string, index: number) => {
        const rankChangeClass = getRankChangeClass(label);
        if (rankChangeClass) {
          const labelElement = chartRef.current.canvas.parentElement.querySelector(
            `[data-label-index="${index}"]`
          );
          if (labelElement) {
            labelElement.classList.add(rankChangeClass);
            setTimeout(() => labelElement.classList.remove(rankChangeClass), 1000);
          }
        }
      });
    }
  }, [data, previousRanks]);

  return (
    <div style={{ height }} className="relative">
      <Bar 
        ref={chartRef}
        data={data} 
        options={{
          ...options,
          animation: {
            duration: 800,
            easing: 'easeInOutQuart'
          }
        }} 
      />
      <style jsx global>{`
        .rank-up {
          animation: slideUp 0.5s ease-out;
          color: #10B981;
        }
        .rank-down {
          animation: slideDown 0.5s ease-out;
          color: #EF4444;
        }
        @keyframes slideUp {
          from { transform: translateY(10px); opacity: 0.5; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideDown {
          from { transform: translateY(-10px); opacity: 0.5; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export const ProblemStats = ({
  problems,
  submissions
}: ProblemStatsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previousRanks, setPreviousRanks] = useState<Record<string, number>>({});
  const [userScores, setUserScores] = useState<UserScore[]>([]);

  // Tính toán điểm và cập nhật thứ hạng
  const calculateScores = () => {
    const scores = submissions.reduce((acc, submission) => {
      const userId = submission.userId;
      if (!userId) return acc;
      
      const userName = submission.user.name || submission.user.email || 'Unknown';
      
      if (!acc[userId]) {
        acc[userId] = {
          name: userName,
          totalScore: 0,
          problemScores: {}
        };
      }

      const currentProblemScore = acc[userId].problemScores[submission.problemId] || 0;
      const newScore = submission.score || 0;
      
      if (newScore > currentProblemScore) {
        acc[userId].problemScores[submission.problemId] = newScore;
        acc[userId].totalScore = Object.values(acc[userId].problemScores)
          .reduce((sum, score) => sum + score, 0);
      }

      return acc;
    }, {} as Record<string, UserScore>);

    return Object.values(scores)
      .sort((a, b) => b.totalScore - a.totalScore);
  };

  // Cập nhật điểm số và thứ hạng
  useEffect(() => {
    // Lưu thứ hạng hiện tại
    const currentRanks = userScores.reduce((acc, user, index) => {
      acc[user.name] = index;
      return acc;
    }, {} as Record<string, number>);

    // Tính toán điểm mới
    const newScores = calculateScores();

    // Cập nhật previous ranks trước khi cập nhật scores mới
    setPreviousRanks(currentRanks);
    setUserScores(newScores);
  }, [submissions]);

  const createChartData = (users: UserScore[]) => ({
    labels: users.map(user => user.name),
    datasets: [
      {
        label: 'Tổng điểm',
        data: users.map(user => user.totalScore),
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(128, 128, 128, 0.8)',
          'rgba(250, 128, 114, 0.8)',
          'rgba(154, 205, 50, 0.8)',
          'rgba(147, 112, 219, 0.8)',
        ],
        borderWidth: 1
      }
    ]
  });

  const chartOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const score = context.raw;
            const rankChange = previousRanks[context.label] !== undefined
              ? previousRanks[context.label] - context.dataIndex
              : 0;
            
            let rankText = '';
            if (rankChange > 0) rankText = ` ↑${rankChange}`;
            else if (rankChange < 0) rankText = ` ↓${Math.abs(rankChange)}`;
            
            return `Điểm: ${score}${rankText}`;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        max: problems.length * 100,
        title: {
          display: true,
          text: 'Điểm số'
        }
      },
      y: {
        title: {
          display: false
        }
      }
    }
  };

  const top10Users = userScores.slice(0, 10);

  return (
    <>
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Biểu đồ điểm</h2>
          {userScores.length > 10 && (
            <Button 
              variant="outline" 
              onClick={() => setIsModalOpen(true)}
            >
              Xem tất cả ({userScores.length})
            </Button>
          )}
        </div>
        <ChartComponent 
          data={createChartData(top10Users)} 
          options={chartOptions}
          previousRanks={previousRanks}
        />
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Biểu đồ điểm tất cả thí sinh</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <ChartComponent 
              data={createChartData(userScores)} 
              options={chartOptions}
              height="600px"
              previousRanks={previousRanks}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};