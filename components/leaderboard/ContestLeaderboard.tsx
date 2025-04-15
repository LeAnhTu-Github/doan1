"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Trophy, Medal, Crown, Clock, Star } from "lucide-react";
import moment from "moment";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

interface LeaderboardEntry {
  userId: string;
  name: string;
  score: number;
  rank: number;
  submissionTime: Date;
}

interface ContestLeaderboardProps {
  contestId: string;
  currentUserScore: number;
}

const ContestLeaderboard = ({ contestId, currentUserScore }: ContestLeaderboardProps) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hiệu ứng confetti khi component mount
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`/api/contests/${contestId}/leaderboard`);
        if (!response.ok) throw new Error("Failed to fetch leaderboard");
        const data = await response.json();
        
        // Sắp xếp theo điểm số và thời gian nộp bài
        const sortedData = data.sort((a: LeaderboardEntry, b: LeaderboardEntry) => {
          if (b.score !== a.score) return b.score - a.score;
          return new Date(a.submissionTime).getTime() - new Date(b.submissionTime).getTime();
        });

        setLeaderboard(sortedData);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        setError("Có lỗi xảy ra khi tải bảng xếp hạng");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [contestId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Đang tải bảng xếp hạng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <div className="text-5xl mb-4">😕</div>
          <p className="text-xl">{error}</p>
        </div>
      </div>
    );
  }

  const getRankColor = (index: number) => {
    switch (index) {
      case 0: return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 1: return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 2: return 'bg-gradient-to-r from-orange-300 to-orange-500';
      default: return 'bg-gray-100';
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Crown className="w-6 h-6 text-yellow-100" />;
      case 1: return <Medal className="w-6 h-6 text-gray-100" />;
      case 2: return <Star className="w-6 h-6 text-orange-100" />;
      default: return null;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6"
    >
      <Card className="max-w-5xl mx-auto p-8 bg-white shadow-2xl rounded-2xl">
        <motion.div 
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          className="text-center mb-12"
        >
          <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Bảng Xếp Hạng</h2>
          <div className="inline-block bg-blue-100 rounded-full px-6 py-3">
            <p className="text-xl text-blue-800">
              Điểm của bạn: <span className="font-bold">{currentUserScore}</span>
            </p>
          </div>
        </motion.div>

        <div className="overflow-hidden rounded-xl shadow-inner">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Thứ hạng</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Thí sinh</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Điểm số</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Thời gian nộp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leaderboard.map((entry, index) => (
                <motion.tr
                  key={entry.userId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`hover:bg-gray-50 transition-colors ${
                    entry.userId === "currentUser" ? "bg-blue-50" : ""
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center
                        ${getRankColor(index)}
                      `}>
                        {getRankIcon(index) || (
                          <span className="text-gray-600 font-semibold">{index + 1}</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{entry.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-xl font-bold text-blue-600">{entry.score}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-2 text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{moment(entry.submissionTime).format('HH:mm:ss DD/MM/YYYY')}</span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
};

export default ContestLeaderboard;