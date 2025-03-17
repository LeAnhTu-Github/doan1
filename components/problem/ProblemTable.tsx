"use client";
import React from "react";
import ClientOnly from "@/components/ClientOnly";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { problemss } from "@/lib/problem";

const ProblemTable = () => {
  const router = useRouter();
  const [filter, setFilter] = useState("Độ khó (All)");
  const bodyContent = (
    <>
      <div className="w-full h-auto">
        <div className="overflow-x-auto w-f">
          <div className=" flex w-full h-auto">
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
              {filter !== "Độ khó (All)" ? (
                <>
                  {problemss
                    .filter((score) => score.difficulty === filter)
                    .map((score) => (
                      <tr key={score.id}>
                        <th>
                          <label>
                            <input type="checkbox" className="checkbox" />
                          </label>
                        </th>
                        <td>{score.title}</td>
                        <td>{score.difficulty}</td>
                        <td>{score.category}</td>
                        <td>{score.time}:00</td>
                        <td>
                          <button
                            className="btn btn-outline btn-sm btn-info mr-2"
                            onClick={() => router.push(`/test/${score.id}`)}
                          >
                            Làm bài
                          </button>
                        </td>
                      </tr>
                    ))}
                </>
              ) : (
                <>
                  {problemss.map((score) => (
                    <tr key={score.id}>
                      <th>
                        <label>
                          <input type="checkbox" className="checkbox" />
                        </label>
                      </th>
                      <td>{score.title}</td>
                      <td>{score.difficulty}</td>
                      <td>{score.category}</td>
                      <td>{score.time}:00</td>
                      <td>
                        <button
                          className="btn btn-outline btn-sm btn-info mr-2"
                          onClick={() => router.push(`/test/${score.id}`)}
                        >
                          Làm bài
                        </button>
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
  return (
    <ClientOnly>
      <div className="max-w-[2520px] mx-auto ">
        <div className="w-full h-auto bg-white p-7 rounded-3xl flex flex-col gap-4">
          <div className="flex gap-4 items-center">
            <div className="w-5 h-9 rounded-md bg-[#fc4222]"></div>
            <p className="text-[#06080F] text-2xl font-semibold">
              Bài kiểm tra
            </p>
          </div>

          {bodyContent}
        </div>
      </div>
    </ClientOnly>
  );
};

export default ProblemTable;
