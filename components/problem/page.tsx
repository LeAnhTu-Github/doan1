import { getAllProblems } from "@/stores/storeProblem";
import ProblemTableClient from "./ProblemTable";

export default async function ProblemsPage() {
    const problems = await getAllProblems(); // Gọi service trực tiếp
    return (
        <div className="max-w-[2520px] mx-auto">
            <div className="w-full h-auto bg-white p-7 rounded-3xl flex flex-col gap-4">
                <div className="flex gap-4 items-center">
                    <div className="w-5 h-9 rounded-md bg-[#fc4222]"></div>
                    <p className="text-[#06080F] text-2xl font-semibold">
                        Bài kiểm tra
                    </p>
                </div>
                <ProblemTableClient initialProblems={problems} />
            </div>
        </div>
    );
}