"use client";
import React from "react";
import ClientOnly from "@/components/ClientOnly";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Problem } from "@prisma/client";
const ProblemTableClient = ({ initialProblems }: { initialProblems: Problem[] }) => {
  const router = useRouter();
  const [filter, setFilter] = useState("Độ khó (All)");

  const filteredProblems =
    filter === "Độ khó (All)"
      ? initialProblems
      : initialProblems.filter((problem) => problem.difficulty === filter);

  const bodyContent = (
    <div className="w-full h-auto">
      <div className="overflow-x-auto w-f">
        <div className="flex w-full h-auto">
          <select
            className="select select-info w-1/5 max-w-60 my-5 mx-2"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="Độ khó (All)">Độ khó (All)</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
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
            {filteredProblems?.length ? filteredProblems!.map((problem) => (
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
      </div>
    </div>
  );

  return <ClientOnly>{bodyContent}</ClientOnly>;
};

export default ProblemTableClient;