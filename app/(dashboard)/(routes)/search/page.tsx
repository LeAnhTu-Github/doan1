import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { SearchInput } from '@/components/search-input';
import { getCourses } from '@/actions/get-courses';
import { CoursesList } from '@/components/courses-list';
import { Categories } from './_components/categories';
import { Suspense } from 'react';

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}

export const dynamic = 'force-dynamic'; // Đánh dấu trang là động

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return redirect('/');
  }

  const [categories, courses, users, regisUsers] = await Promise.all([
    db.category.findMany({
      orderBy: {
        name: 'asc',
      },
    }),
    getCourses({
      userId,
      ...searchParams,
    }),
    db.user.findMany({
      where: {
        id: userId,
      },
    }),
    db.courseRegister.findMany({
      where: {
        userId: userId,
      },
    }),
  ]);

  const user = users[0];
  const regis = regisUsers[0];

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
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
      </div>
    </Suspense>
  );
};

export default SearchPage;