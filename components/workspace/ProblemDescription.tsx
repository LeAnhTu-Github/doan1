"use client";
import CircleSkeleton from "../Sekeletons/CircleSkeleton";
import RectangleSkeleton from "../Sekeletons/RectangleSkeleton";
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
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";

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

  const problemDifficultyClass = "bg-dark-layer-1 text-dark-layer-1 dark:bg-gray-200 dark:text-gray-800";
  const solved = false;

  if (loading) {
    return (
      <div className="bg-dark-layer-1 dark:bg-gray-100">
        <div className="flex h-11 w-full items-center pt-2 bg-dark-layer-2 dark:bg-gray-200 text-white dark:text-gray-800 overflow-x-hidden">
          <Link 
            href="/"
            className="flex items-center px-5 py-[10px] text-xs hover:text-blue-500 dark:hover:text-blue-600 transition-colors"
          >
            <IoArrowBack className="h-4 w-4 mr-2" />
            Trang chủ
          </Link>
          <div className="bg-dark-layer-1 dark:bg-gray-100 rounded-t-[5px] px-5 py-[10px] text-xs cursor-pointer">
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

  if (!problems) {
    return (
      <div className="bg-dark-layer-1 dark:bg-gray-100">
        <div className="flex h-11 w-full items-center pt-2 bg-dark-layer-2 dark:bg-gray-200 text-white dark:text-gray-800 overflow-x-hidden">
          <Link 
            href="/"
            className="flex items-center px-5 py-[10px] text-xs hover:text-blue-500 dark:hover:text-blue-600 transition-colors"
          >
            <IoArrowBack className="h-4 w-4 mr-2" />
            Trang chủ
          </Link>
          <div className="bg-dark-layer-1 dark:bg-gray-100 rounded-t-[5px] px-5 py-[10px] text-xs cursor-pointer">
            {`Miêu tả bài toán`}
          </div>
        </div>
        <div className="flex px-0 py-4 h-[calc(100vh-94px)] overflow-y-auto">
          <div className="px-5 text-white dark:text-gray-800">Không tìm thấy bài tập nào</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark-layer-1 dark:bg-gray-100">
      <div className="flex h-11 w-full items-center pt-2 bg-dark-layer-2 dark:bg-gray-200 text-white dark:text-gray-800 overflow-x-hidden">
        <Link 
          href="/"
          className="flex items-center px-5 py-[10px] text-xs hover:text-blue-500 dark:hover:text-blue-600 transition-colors"
        >
          <IoArrowBack className="h-4 w-4 mr-2" />
          Trang chủ
        </Link>
        <div className="bg-dark-layer-1 dark:bg-gray-100 rounded-t-[5px] px-5 py-[10px] text-xs cursor-pointer">
          {`Miêu tả bài toán`}
        </div>
      </div>

      <div className="flex px-0 py-4 h-[calc(100vh-94px)] overflow-y-auto">
        <div className="px-5">
          <div className="w-full">
            <div className="flex space-x-4">
              <div className="flex-1 mr-2 text-lg text-white dark:text-gray-800 font-medium">
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
                <div className="rounded p-[3px] ml-4 text-lg transition-colors duration-200 text-green-s text-dark-green-s dark:text-green-600">
                  <BsCheck2Circle />
                </div>
              )}
            </div>

            <div className="text-white dark:text-gray-800 text-sm">
              <div
                dangerouslySetInnerHTML={{ __html: problems.problemStatement }}
              />
            </div>

            <div className="mt-4">
              {problems.examples && Array.isArray(problems.examples) ? (
                problems.examples.map((example: any, index: number) => (
                  <div key={index}>
                    <p className="font-medium text-white dark:text-gray-800">
                      Ví dụ {index + 1}:
                    </p>
                    {example.img && (
                      <Image src={example.img} alt="" className="mt-3" />
                    )}
                    <div className="example-card">
                      <pre>
                        <strong className="text-white dark:text-gray-800">Đầu vào: </strong>
                        {example.inputText || example.input}
                        <br />
                        <strong>Đầu ra: </strong>
                        {example.outputText || example.output}
                        <br />
                        {example.explanation && (
                          <>
                            <strong>Giải thích: </strong>
                            {example.explanation}
                          </>
                        )}
                      </pre>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-white dark:text-gray-800">Không có ví dụ</p>
              )}
            </div>

            <div className="my-8 pb-4">
              <div className="text-white dark:text-gray-800 text-sm font-medium">Giới hạn:</div>
              <ul className="text-white dark:text-gray-800 ml-5 list-disc">
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