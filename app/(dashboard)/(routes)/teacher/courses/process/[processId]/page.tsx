import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCourses } from "@/actions/get-courses";
import { db } from "@/lib/db";
import { Course } from "@prisma/client";
import { Category } from "@prisma/client";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { number } from "zod";
import { courseRegister } from "@prisma/client";
import { UserProgress } from "@prisma/client";
type CourseWithProgressWithCategory = {
  courseRegister: courseRegister;
  progress: number | null;
  userProgress: UserProgress;
};
const ProcessPage = async ({ params }: { params: { processId: string } }) => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return redirect("/");
  }

  const chapters = await db.chapter.findMany({
    where: { courseId: params.processId },
    select: { id: true },
  });
  const chapterIds = chapters.map((c) => c.id);

  const regisUser = await db.courseRegister.findMany({
    where: { courseId: params.processId },
    orderBy: { createdAt: "desc" },
  });

  const userProgressList = await db.userProgress.findMany({
    where: { chapterId: { in: chapterIds } },
  });

  const dataWithProgress = regisUser.map((user) => {
    const completed = userProgressList.filter(
      (up) => up.userId === user.userId && up.isCompleted
    ).length;
    const progress =
      chapters.length > 0 ? Math.round((completed / chapters.length) * 100) : 0;
    return { ...user, progress };
  });

  const courses = await getCourses({
    userId,
    ...URLSearchParams,
  });
  const mergedData = dataWithProgress.map((user) => {
    // Find the corresponding course for the user
    const course = courses.find((course) => course.id === user.courseId);

    // If a corresponding course is found, merge the user and course objects
    if (course) {
      return { ...user, ...course };
    }

    // If no corresponding course is found, return the user object as is
    return user;
  });
  // Add missing properties to the events array
  const updatedEvents = dataWithProgress.map((event) => ({
    ...event,
    ...mergedData.find((course) => course.id === event.courseId),
  })) as [];
  return (
    <div className="p-6">
      <DataTable columns={columns} data={dataWithProgress} users={regisUser} />
    </div>
  );
};

export default ProcessPage;
