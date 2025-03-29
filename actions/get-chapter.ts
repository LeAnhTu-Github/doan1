import { db } from "@/lib/db";
import { Attachment, Chapter } from "@prisma/client";

interface GetChapterProps {
  userId: string;
  courseId: string;
  chapterId: string;
}

export const getChapter = async ({
  userId,
  courseId,
  chapterId,
}: GetChapterProps) => {
  try {
    // Lấy thông tin khóa học
    const course = await db.course.findUnique({
      where: {
        isPublished: true,
        id: courseId,
      },
      select: {
        price: true,
      },
    });

    // Lấy thông tin chapter
    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        isPublished: true,
      },
    });

    if (!chapter || !course) {
      throw new Error("Chapter or course not found");
    }

    // Lấy muxData (không phụ thuộc vào isFree)
    const muxData = await db.muxData.findUnique({
      where: {
        chapterId: chapterId,
      },
    });

    // Lấy attachments (nếu cần)
    const attachments: Attachment[] = await db.attachment.findMany({
      where: {
        courseId: courseId,
      },
    });

    // Lấy chapter tiếp theo (không phụ thuộc vào isFree)
    const nextChapter = await db.chapter.findFirst({
      where: {
        courseId: courseId,
        isPublished: true,
        position: {
          gt: chapter?.position,
        },
      },
      orderBy: {
        position: "asc",
      },
    });

    // Lấy chapter trước đó
    const previousChapter = await db.chapter.findFirst({
      where: {
        courseId: courseId,
        isPublished: true,
        position: {
          lt: chapter?.position,
        },
      },
      orderBy: {
        position: "desc",
      },
    });

    // Lấy userProgress (nếu cần)
    const userProgress = await db.userProgress.findFirst({
      where: {
        userId: userId,
        chapterId: chapterId,
      },
    });

    return {
      chapter,
      course,
      muxData,
      attachments,
      nextChapter,
      previousChapter,
      userProgress,
    };
  } catch (error) {
    console.log("[GET_CHAPTER]", error);
    throw new Error("Failed to fetch chapter data");
  }
};