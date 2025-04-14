import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import New from "@/components/news/New";
import { CoursesList } from "@/components/courses-list";
import { InfoCard } from "./_components/info-card";
import { SearchInput } from "@/components/search-input";
import { Categories } from "../search/_components/categories";
import Section from "@/components/section/Section";
import { db } from "@/lib/db";
import { getCourses } from "@/actions/get-courses";
import Footer from "@/components/Footer";
import ProblemsPage from "@/components/problem/page";
import ContestPage from "@/components/contests/Contest";
import Leaderboard from "@/components/leaderboard/Leaderboard";

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}

export default async function Dashboard({ searchParams }: SearchPageProps) {
  const session = await getServerSession(authOptions);
  const users = await db.user.findUnique({
    where: {
      email: session?.user?.email!,
    },
  });

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
      userId: users?.id!,
    },
  });
  const regisEvents = await db.userRegister.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  const regis = regisUsers[0];
  const courses = await getCourses({
    userId: users?.id!,
    ...searchParams,
  });

  return (
    <div className="p-6 space-y-4 bg-[#F3F3F3]">
      <Section />
      <ContestPage />
      <div className="w-full bg-white p-7 rounded-3xl">
        <div className="flex gap-4 items-center mb-6">
          <div className="w-5 h-9 rounded-md bg-[#4d8aed]"></div>
          <p className="text-[#06080F] text-2xl font-semibold">
            Bảng xếp hạng
          </p>
        </div>
        <Leaderboard />
      </div>
      <New events={events} userId={users?.id!} regis={regisEvents} />
      
      <div className="w-full bg-white p-7 rounded-3xl flex flex-col gap-4 mt-4">
        <div className="flex gap-4 items-center">
          <div className="w-5 h-9 rounded-md bg-[#4d8aed]"></div>
          <p className="text-[#06080F] text-2xl font-semibold">
            Các khoá học
          </p>
        </div>
        <div className="pt-6 md:hidden md:mb-0 block">
          <SearchInput />
        </div>
        <div className="py-6 space-y-4">
          <Categories items={categories} />
          <CoursesList items={courses} user={users!} regis={regis} />
        </div>
      </div>
      
      <ProblemsPage />
      <Footer />
    </div>
  );
}
