"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Medal } from "lucide-react";
import Image from "next/image"; // Import Next.js Image component
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Avatar from "@/components/Avatar";

interface LeaderboardEntry {
  id: string;
  clerkUserId: string;
  totalScore: number;
  solvedCount: number;
  rank: number;
  user: {
    name: string;
    masv: string;
    class: string;
    image: string | null;
  };
}

interface TimeFilter {
  label: string;
  value: string;
}

const timeFilters: TimeFilter[] = [
  { label: "Tất cả", value: "all" },
  { label: "Hôm nay", value: "day" },
  { label: "Tuần này", value: "week" },
  { label: "Tháng này", value: "month" },
];

const ITEMS_PER_PAGE = 10;

const TopThreeCard = ({ entry, totalProblems }: { entry: LeaderboardEntry; totalProblems: number }) => {
  const medals = {
    1: { color: "bg-yellow-500", icon: "🥇" },
    2: { color: "bg-gray-400", icon: "🥈" },
    3: { color: "bg-amber-600", icon: "🥉" },
  };

  const medal = medals[entry.rank as keyof typeof medals];
  
  return (
    <Card className={`p-6 flex flex-col items-center justify-center gap-4 transform hover:scale-105 transition-transform duration-200 ${entry.rank === 1 ? 'bg-gradient-to-br from-yellow-100 to-yellow-50' : ''}`}>
      <div className="relative">
        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg relative">
          <Image
            src={entry.user?.image || "/images/placeholder.jpg"}
            alt={entry.user?.name || "User"}
            fill
            sizes="80px"
            className="object-cover"
            priority={entry.rank === 1} // Optional: prioritize loading for top rank
          />
        </div>
        <span className="absolute -top-2 -right-2 text-2xl">{medal.icon}</span>
      </div>
      <div className="text-center">
        <h3 className="font-bold text-lg">{entry.user?.name || "Anonymous"}</h3>
        <p className="text-sm text-gray-500">{entry.user?.masv}</p>
        <p className="text-sm text-gray-500">{entry.user?.class}</p>
        <div className="mt-2">
          <p className="text-2xl font-bold text-primary">{entry.totalScore.toFixed(2)}</p>
          <p className="text-sm text-gray-500">{entry.solvedCount} / {totalProblems} bài giải</p>
        </div>
      </div>
    </Card>
  );
};

const UserCell = ({ user, rank }: { user: LeaderboardEntry['user']; rank: number }) => {
  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1: return "🥇";
      case 2: return "🥈";
      case 3: return "🥉";
      default: return null;
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 relative">
        <Avatar 
          src={user?.image} 
          width={40}
          height={40}
        />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="font-medium">{user?.name || "Anonymous"}</span>
          {getMedalIcon(rank) && (
            <span className="text-lg">{getMedalIcon(rank)}</span>
          )}
        </div>
        <span className="text-sm text-gray-500">{user?.masv}</span>
      </div>
    </div>
  );
};

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [timeFilter, setTimeFilter] = useState<string>("all");
  const [totalProblems, setTotalProblems] = useState(0);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(`/api/leaderboard?timeFilter=${timeFilter}`);
        setLeaderboard(response.data.leaderboard);
        const problemsResponse = await axios.get('/api/problems/count');
        setTotalProblems(problemsResponse.data.count);
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [timeFilter]);

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[400px]">Loading...</div>;
  }

  const topThree = leaderboard.slice(0, 3);
  const totalPages = Math.ceil(leaderboard.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPageData = leaderboard.slice(startIndex, endIndex);

  return (
    <div className="space-y-8">
      {/* Time Filter */}
      <div className="flex justify-end">
        <Select
          value={timeFilter}
          onValueChange={(value) => {
            setTimeFilter(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time period" />
          </SelectTrigger>
          <SelectContent>
            {timeFilters.map((filter) => (
              <SelectItem key={filter.value} value={filter.value}>
                {filter.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Top 3 Cards */}
      {leaderboard.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:mt-8">
            {topThree[1] && <TopThreeCard entry={topThree[1]} totalProblems={totalProblems} />}
          </div>
          <div className="md:-mt-4">
            {topThree[0] && <TopThreeCard entry={topThree[0]} totalProblems={totalProblems} />}
          </div>
          <div className="md:mt-8">
            {topThree[2] && <TopThreeCard entry={topThree[2]} totalProblems={totalProblems} />}
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-28">Xếp hạng</TableHead>
              <TableHead>Thông tin</TableHead>
              <TableHead>Lớp</TableHead>
              <TableHead>Điểm</TableHead>
              <TableHead>Số bài giải</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentPageData.length > 0 ? (
              currentPageData.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium text-lg">#{entry.rank}</TableCell>
                  <TableCell>
                    <UserCell user={entry.user} rank={entry.rank} />
                  </TableCell>
                  <TableCell>{entry.user?.class}</TableCell>
                  <TableCell>{entry.totalScore.toFixed(2)}</TableCell>
                  <TableCell>
                    {entry.solvedCount} / {totalProblems} Bài
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5}>
                  <div className="text-center text-gray-500 py-8">
                    Không có dữ liệu bảng xếp hạng.
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {leaderboard.length > 0 && totalPages > 1 && (
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </Card>
    </div>
  );
}