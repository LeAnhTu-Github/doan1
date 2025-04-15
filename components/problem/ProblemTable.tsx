"use client";
import React from "react";
import ClientOnly from "@/components/ClientOnly";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Problem } from "@prisma/client";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 10;

// Hàm helper để chuyển đổi độ khó từ tiếng Anh sang tiếng Việt
const getDifficultyInVietnamese = (difficulty: string | null) => {
  if (!difficulty) return "Không xác định";
  
  switch (difficulty) {
    case "Easy":
      return "Dễ";
    case "Medium":
      return "Trung bình";
    case "Hard":
      return "Khó";
    default:
      return difficulty;
  }
};

// Hàm helper để lấy màu cho độ khó
const getDifficultyColor = (difficulty: string | null) => {
  if (!difficulty) return "bg-gray-100 text-gray-600";
  
  switch (difficulty) {
    case "Easy":
      return "bg-green-100 text-green-700";
    case "Medium":
      return "bg-yellow-100 text-yellow-700";
    case "Hard":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const ProblemTableClient = ({ initialProblems }: { initialProblems: Problem[] }) => {
  const router = useRouter();
  const [filter, setFilter] = useState("Độ khó (All)");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProblems =
    filter === "Độ khó (All)"
      ? initialProblems
      : initialProblems.filter((problem) => problem.difficulty === filter);

  const totalPages = Math.ceil(filteredProblems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPageData = filteredProblems.slice(startIndex, endIndex);

  const bodyContent = (
    <div className="w-full h-auto p-4 bg-white rounded-lg shadow-sm">
      <div className="mb-6">
        <select
          className="px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-48
                     transition-all duration-200 ease-in-out bg-white"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="Độ khó (All)">Tất cả độ khó</option>
          <option value="Easy">Dễ</option>
          <option value="Medium">Trung bình</option>
          <option value="Hard">Khó</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Đề bài
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mức độ
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thể loại
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thời gian
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentPageData.length ? currentPageData.map((problem) => (
              <tr key={problem.id} className="hover:bg-gray-50 transition-colors duration-200">
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{problem.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
                    {getDifficultyInVietnamese(problem.difficulty)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{problem.category}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {problem.time instanceof Date
                    ? problem.time.toLocaleTimeString()
                    : problem.time
                      ? `${problem.time}:00`
                      : "30 phút"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => router.push(`/problem/${problem.id}`)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    Làm bài
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  Không có bài tập nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className={currentPage === 1 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, index) => (
                <PaginationItem key={index + 1}>
                  <PaginationLink
                    onClick={() => setCurrentPage(index + 1)}
                    className={`${currentPage === index + 1 ? 'bg-blue-100' : ''} cursor-pointer`}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className={currentPage === totalPages ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );

  return <ClientOnly>{bodyContent}</ClientOnly>;
};

export default ProblemTableClient;