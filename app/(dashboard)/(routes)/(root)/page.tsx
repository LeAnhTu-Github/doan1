import { auth, currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import New from "@/components/news/New";
import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import { CoursesList } from "@/components/courses-list";
import { InfoCard } from "./_components/info-card";
import { SearchInput } from "@/components/search-input";
import { Categories } from "../search/_components/categories";
import Section from "@/components/section/Section";
import { db } from "@/lib/db";
import { getCourses } from "@/actions/get-courses";
import Footer from "@/components/Footer";
import ProblemTable from "@/components/problem/ProblemTable";
import ClientOnly from "@/components/ClientOnly";
import { SetStateAction } from "react";
interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}
export default async function Dashboard({ searchParams }: SearchPageProps) {
  const currentUsers = await currentUser();

  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }

  const { completedCourses, coursesInProgress } = await getDashboardCourses(
    userId
  );
  const users = await db.user.findMany({
    where: {
      id: userId,
    },
  });
  const user = users[0];
  const events = await db.event.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
  const regisUsers = await db.courseRegister.findMany({
    where: {
      userId: userId,
    },
  });
  const regisEvents = await db.userRegister.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  const regis = regisUsers[0];
  const courses = await getCourses({
    userId,
    ...searchParams,
  });

  return (
    <div className="p-6 space-y-4 bg-[#F3F3F3]">
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          icon={Clock}
          label="In Progress"
          numberOfItems={coursesInProgress.length}
        />
        <InfoCard
          icon={CheckCircle}
          label="Completed"
          numberOfItems={completedCourses.length}
          variant="success"
        />
      </div> */}
      <Section currentUsers={currentUsers} />
      <New events={events} userId={userId} regis={regisEvents} />
      <>
        <div className="w-full bg-white  p-7 rounded-3xl flex flex-col gap-4 mt-4">
          <div className="flex gap-4 items-center">
            <div className="w-5 h-9 rounded-md bg-[#4d8aed]"></div>
            <p className="text-[#06080F] text-2xl font-semibold">
              Các khoá học
            </p>
          </div>
          <div className=" pt-6 md:hidden md:mb-0 block ">
            <SearchInput />
          </div>
          <div className="py-6 space-y-4">
            <Categories items={categories} />
            <CoursesList items={courses} user={user} regis={regis} />
          </div>
        </div>
      </>
      <ProblemTable />
      {/* <CoursesList items={[...coursesInProgress, ...completedCourses]} /> */}
      <Footer />
    </div>
  );
}
