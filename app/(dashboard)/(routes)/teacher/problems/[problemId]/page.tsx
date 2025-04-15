import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LayoutDashboard } from "lucide-react";
import { Problem as PrismaProblems, TestCase } from "@prisma/client";

import { db } from "@/lib/db";
import { IconBadge } from "@/components/icon-badge";
import { Banner } from "@/components/banner";

import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { DifficultyForm } from "./_components/difficulty-form";
import { CategoryForm } from "./_components/category-form";
import { TestCasesForm } from "./_components/test-cases-form";
import { Actions } from "./_components/actions";

// Extend type Problem để bao gồm cả testCases
type ProblemWithTestCases = PrismaProblems & {
  testCases: TestCase[];
};

// Định nghĩa các type cho form components
type TitleFormData = Pick<PrismaProblems, 'title'>;
type DescriptionFormData = Pick<PrismaProblems, 'problemStatement'>;
type DifficultyFormData = Pick<PrismaProblems, 'difficulty'>;
type CategoryFormData = Pick<PrismaProblems, 'category'>;

const ProblemIdPage = async ({ params }: { params: { problemId: string } }) => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return redirect("/");
  }

  const problem = params.problemId === "new" 
    ? null 
    : await db.problem.findUnique({
        where: {
          id: params.problemId,
        },
        include: {
          testCases: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      }) as ProblemWithTestCases | null;

  const categories = [
    "Array", "String", "Linked List", "Trees", "Dynamic Programming",
    "Graph", "Bit Manipulation", "Math", "Sorting", "Binary Search",
    "Backtracking", "Matrix", "Hash Table", "Stack", "Queue",
    "Heap", "Greedy", "Two Pointers", "Sliding Window", "Other",
  ];

  const difficulties = ["Easy", "Medium", "Hard"];

  if (params.problemId !== "new" && !problem) {
    return redirect("/teacher/problems");
  }

  const requiredFields = problem ? [
    problem.title,
    problem.problemStatement,
    problem.difficulty,
    problem.category,
    problem.testCases.length > 0,
  ] : [];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {problem && !problem.status && (
        <Banner label="Bài tập này chưa được xuất bản. Nó sẽ không được nhìn thấy bởi các sinh viên." />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">
              {params.problemId === "new" ? "Tạo bài tập mới" : "Chỉnh sửa bài tập"}
            </h1>
            {problem && (
              <span className="text-sm text-slate-700">
                Hoàn thành tất cả các trường {completionText}
              </span>
            )}
          </div>
          {problem && (
            <Actions
              disabled={!isComplete}
              problemId={params.problemId}
              isPublished={problem.status || false}
            />
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Thông tin bài tập</h2>
            </div>
            <TitleForm 
              initialData={problem ? { title: problem.title } : null} 
              problemId={params.problemId} 
            />
            <DescriptionForm 
              initialData={problem ? { problemStatement: problem.problemStatement } : null} 
              problemId={params.problemId} 
            />
            <DifficultyForm 
              initialData={problem ? { difficulty: problem.difficulty } : null}
              problemId={params.problemId} 
              options={difficulties.map((difficulty) => ({
                label: difficulty,
                value: difficulty,
              }))}
            />
            <CategoryForm
              initialData={problem ? { category: problem.category } : null}
              problemId={params.problemId}
              options={categories.map((category) => ({
                label: category,
                value: category,
              }))}
            />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Test Cases</h2>
              </div>
              <TestCasesForm 
                initialData={problem ? { 
                  id: problem.id,
                  testCases: problem.testCases 
                } : null} 
                problemId={params.problemId} 
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProblemIdPage; 