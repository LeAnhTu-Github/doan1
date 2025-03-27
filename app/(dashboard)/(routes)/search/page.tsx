import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { SearchInput } from "@/components/search-input";
import { getCourses } from "@/actions/get-courses";
import { CoursesList } from "@/components/courses-list";

import { Categories } from "./_components/categories";

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const courses = await getCourses({
    userId,
    ...searchParams,
  });
  const users = await db.user.findMany({
    where: {
      clerkUserId: userId,
    },
  });
  const user = users[0];
  const regisUsers = await db.courseRegister.findMany({
    where: {
      userId: userId,
    },
  });
  const regis = regisUsers[0];
  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <div className="p-6 space-y-4">
        <div className="flex gap-4 items-center">
          <div className="w-5 h-9 rounded-md bg-[#4d8aed]"></div>
          <p className="text-[#06080F] text-2xl font-semibold">Các khoá học</p>
        </div>
        <Categories items={categories} />
        <CoursesList items={courses} user={user} regis={regis} />
      </div>
    </>
  );
};

export default SearchPage;
