"use client";

import { Card } from "@/components/ui/card";
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

export const ProblemStats = ({
  problems,
  submissions
}: ProblemStatsProps) => {
  // Tính tổng điểm cho mỗi người tham gia
  const userScores = submissions.reduce((acc, submission) => {
    const userId = submission.userId;
    // Skip if userId is null
    if (!userId) return acc;
    
    const userName = submission.user.name || submission.user.email || 'Unknown';
    
    if (!acc[userId]) {
      acc[userId] = {
        name: userName,
        totalScore: 0,
        problemScores: {} // Lưu điểm cao nhất cho mỗi bài
      };
    }

    // Chỉ cập nhật điểm nếu là điểm cao hơn cho bài đó
    const currentProblemScore = acc[userId].problemScores[submission.problemId] || 0;
    const newScore = submission.score || 0;
    
    if (newScore > currentProblemScore) {
      acc[userId].problemScores[submission.problemId] = newScore;
      // Cập nhật lại tổng điểm
      acc[userId].totalScore = Object.values(acc[userId].problemScores).reduce((sum, score) => sum + score, 0);
    }

    return acc;
  }, {} as Record<string, { name: string; totalScore: number; problemScores: Record<string, number> }>);

  // Chuyển đổi thành mảng và sắp xếp theo điểm
  const sortedUsers = Object.values(userScores)
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 10); // Chỉ lấy top 10

  const data = {
    labels: sortedUsers.map(user => user.name),
    datasets: [
      {
        label: 'Tổng điểm',
        data: sortedUsers.map(user => user.totalScore),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Bảng xếp hạng theo điểm'
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const score = context.raw;
            return `Điểm: ${score}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: problems.length * 100,
        title: {
          display: true,
          text: 'Điểm số'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Thí sinh'
        }
      }
    }
  };

  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">Bảng xếp hạng</h2>
      <Bar data={data} options={options} />
    </Card>
  );
};