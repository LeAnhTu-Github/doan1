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

const ProblemTableClient = ({ initialProblems }: { initialProblems: Problem[] }) => {
  const router = useRouter();
  const [filter, setFilter] = useState("Độ khó (All)");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProblems =
    filter === "Độ khó (All)"
      ? initialProblems
      : initialProblems.filter((problem) => problem.difficulty === filter);

  // Pagination logic
  const totalPages = Math.ceil(filteredProblems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPageData = filteredProblems.slice(startIndex, endIndex);

  const bodyContent = (
    <div className="w-full h-auto">
      <div className="overflow-x-auto w-f">
        <div className="flex w-full h-auto">
          <select
            className="select select-info w-1/5 max-w-60 my-5 mx-2"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(1); // Reset to first page when filter changes
            }}
          >
            <option value="Độ khó (All)">Độ khó (All)</option>
            <option value="Easy">Dễ</option>
            <option value="Medium">Trung bình</option>
            <option value="Hard">Khó</option>
          </select>
        </div>
        <table className="table">
          <thead>
            <tr className="bg-base-200 rounded-2xl z-0 w-full">
              <th></th>
              <th>Đề bài</th>
              <th>Mức độ</th>
              <th>Thể loại</th>
              <th>Thời gian làm</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentPageData.length ? currentPageData.map((problem) => (
              <tr key={problem.id}>
                <th>
                  <label>
                    <input type="checkbox" className="checkbox" />
                  </label>
                </th>
                <td>{problem.title}</td>
                <td>{problem.difficulty}</td>
                <td>{problem.category}</td>
                <td>
                  {problem.time instanceof Date
                    ? problem.time.toLocaleTimeString()
                    : problem.time
                      ? `${problem.time}:00`
                      : "N/A"}
                </td>
                <td>
                  <button
                    className="btn btn-outline btn-sm btn-info mr-2"
                    onClick={() => router.push(`/problem/${problem.id}`)}
                  >
                    Làm bài
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="text-center">
                  Không có bài tập nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
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
      </div>
    </div>
  );

  return <ClientOnly>{bodyContent}</ClientOnly>;
};

export default ProblemTableClient;