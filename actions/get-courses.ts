import { Category, Course } from "@prisma/client";
import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

type GetCourses = {
  userId: string;
  title?: string;
  categoryId?: string;
};

export const getCourses = async ({
  userId,
  title,
  categoryId,
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
  try {
    const whereCondition: any = {
      isPublished: true,
      title: title ? { contains: title, mode: "insensitive" } : undefined,
    };

    if (categoryId && categoryId.trim() !== "") {
      whereCondition.categoryId = categoryId;
    }

    const courses = await db.course.findMany({
      where: whereCondition,
      include: {
        category: true,
        chapters: {
          where: { isPublished: true },
          select: { id: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const coursesWithProgress: CourseWithProgressWithCategory[] = await Promise.all(
      courses.map(async (course) => {
        const progressPercentage = await getProgress(userId, course.id);
        return { ...course, progress: progressPercentage };
      })
    );

    return coursesWithProgress;
  } catch (error) {
    console.error("[GET_COURSES] Error:", error);
    return [];
  }
};
