"use client";
import CircleSkeleton from "../Sekeletons/CircleSkeleton";
import RectangleSkeleton from "../Sekeletons/RectangleSkeleton";
import { twoSum } from "@/utils/problems/two-sum";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  AiFillLike,
  AiFillDislike,
  AiOutlineLoading3Quarters,
  AiFillStar,
} from "react-icons/ai";
import { BsCheck2Circle } from "react-icons/bs";
import { TiStarOutline } from "react-icons/ti";
import { Problem } from "@prisma/client";

interface IProps {
  ProblemId: string;
}

const ProblemDescription = ({ ProblemId }: IProps) => {
  const [problems, setProblems] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/problems/${ProblemId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch problem");
        }
        const data = await response.json();
        setProblems(data);
      } catch (error) {
        console.error("Error fetching problem:", error);
      } finally {
        setLoading(false);
      }
    };

    if (ProblemId) {
      fetchProblem();
    }
  }, [ProblemId]);

  const currentProblem = twoSum;
  const problemDifficultyClass = "bg-dark-layer-1 text-dark-layer-1";
  const liked = false;
  const disliked = false;
  const solved = false;
  const starred = false;
  const updating = false;

  // Nếu chưa có dữ liệu hoặc đang loading
  if (loading) {
    return (
      <div className="bg-dark-layer-1">
        <div className="flex h-11 w-full items-center pt-2 bg-dark-layer-2 text-white overflow-x-hidden">
          <div className="bg-dark-layer-1 rounded-t-[5px] px-5 py-[10px] text-xs cursor-pointer">
            {`Description - id: ${ProblemId}`}
          </div>
        </div>
        <div className="flex px-0 py-4 h-[calc(100vh-94px)] overflow-y-auto">
          <div className="px-5">
            <div className="mt-3 flex space-x-2">
              <RectangleSkeleton />
              <CircleSkeleton />
              <RectangleSkeleton />
              <RectangleSkeleton />
              <CircleSkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Nếu không có problems (fetch thất bại)
  if (!problems) {
    return (
      <div className="bg-dark-layer-1">
        <div className="flex h-11 w-full items-center pt-2 bg-dark-layer-2 text-white overflow-x-hidden">
          <div className="bg-dark-layer-1 rounded-t-[5px] px-5 py-[10px] text-xs cursor-pointer">
            {`Description - id: ${ProblemId}`}
          </div>
        </div>
        <div className="flex px-0 py-4 h-[calc(100vh-94px)] overflow-y-auto">
          <div className="px-5 text-white">Không tìm thấy bài kiểm tra</div>
        </div>
      </div>
    );
  }

  // Khi có dữ liệu
  return (
    <div className="bg-dark-layer-1">
      {/* TAB */}
      <div className="flex h-11 w-full items-center pt-2 bg-dark-layer-2 text-white overflow-x-hidden">
        <div className="bg-dark-layer-1 rounded-t-[5px] px-5 py-[10px] text-xs cursor-pointer">
          {`Description - id: ${ProblemId}`}
        </div>
      </div>

      <div className="flex px-0 py-4 h-[calc(100vh-94px)] overflow-y-auto">
        <div className="px-5">
          {/* Problem heading */}
          <div className="w-full">
            <div className="flex space-x-4">
              <div className="flex-1 mr-2 text-lg text-white font-medium">
                {problems.title}
              </div>
            </div>

            <div className="flex items-center mt-3">
              <div
                className={`${problemDifficultyClass} inline-block rounded-[21px] bg-opacity-[.15] px-2.5 py-1 text-xs font-medium capitalize`}
              >
                {problems.difficulty}
              </div>
              {solved && (
                <div className="rounded p-[3px] ml-4 text-lg transition-colors duration-200 text-green-s text-dark-green-s">
                  <BsCheck2Circle />
                </div>
              )}
            </div>

            {/* Problem Statement */}
            <div className="text-white text-sm">
              <div
                dangerouslySetInnerHTML={{ __html: problems.problemStatement }}
              />
            </div>

            {/* Examples */}
            <div className="mt-4">
              {problems.examples && Array.isArray(problems.examples) ? (
                problems.examples.map((example: any, index: number) => (
                  <div key={index}>
                    <p className="font-medium text-white">
                      Example {index + 1}:
                    </p>
                    {example.img && (
                      <Image src={example.img} alt="" className="mt-3" />
                    )}
                    <div className="example-card">
                      <pre>
                        <strong className="text-white">Input: </strong>
                        {example.inputText || example.input}
                        <br />
                        <strong>Output: </strong>
                        {example.outputText || example.output}
                        <br />
                        {example.explanation && (
                          <>
                            <strong>Explanation: </strong>
                            {example.explanation}
                          </>
                        )}
                      </pre>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-white">No examples available</p>
              )}
            </div>

            {/* Constraints */}
            <div className="my-8 pb-4">
              <div className="text-white text-sm font-medium">Constraints:</div>
              <ul className="text-white ml-5 list-disc">
                <div
                  dangerouslySetInnerHTML={{ __html: problems.constraints }}
                />
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemDescription;