import { Suspense } from "react";
import { SubmissionsList } from "./submission-list";
import { getSubmissions } from "./actions";

const SubmissionCodePage = async ({
  params
}: {
  params: { contestId: string }
}) => {
  const submissions = await getSubmissions(params.contestId);

  if (!submissions.length) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Không có bài nộp nào</h1>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Code bài nộp</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <SubmissionsList 
          submissions={submissions
            .filter(submission => submission.user !== null)
            .map(submission => ({
              ...submission,
              problem: {
                ...submission.problem,
                title: submission.problem.title ?? 'Unknown'
              }
            }))} 
        />
      </Suspense>
    </div>
  );
};

export default SubmissionCodePage;