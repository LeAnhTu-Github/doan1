import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { File } from "lucide-react";
import axios from "axios";
import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import { db } from "@/lib/db";
import { VideoPlayer } from "./_components/video-player";
import { CourseProgressButton } from "./_components/course-progress-button";

const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }
  const {
    chapter,
    course,
    muxData,
    attachments,
    nextChapter,
    userProgress,
    previousChapter,
  } = await getChapter({
    userId,
    chapterId: params.chapterId,
    courseId: params.courseId,
  });
  // const useProgress = await db.userProgress.findMany({
  //   orderBy: {
  //     createdAt: "desc",
  //   },
  // });
  // const check = useProgress.some(
  //   (process) =>
  //     process.chapterId === previousChapter?.id &&
  //     process.userId === userId &&
  //     process.isCompleted
  // );
  // const isLocked = previousChapter ? !check : false;
  const isLocked = previousChapter ? true : false;
  //const completeOnEnd = !userProgress?.isCompleted;
  const completeOnEnd = false;
  return (
    <div>
      {/* {userProgress?.isCompleted && (
        <Banner variant="success" label="Bài này đã được hoàn thành." />
      )} */}
      {isLocked && (
        <Banner
          variant="warning"
          label="Bạn cần hoàn thành bài học trước đó để mở khoá bài học mới."
        />
      )}
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            chapterId={params?.chapterId}
            title={chapter?.title ?? ""}
            courseId={params?.courseId}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId!}
            isLocked={!!isLocked}
            completeOnEnd={completeOnEnd}
          />
        </div>
        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2">{chapter?.title}</h2>

            <CourseProgressButton
              chapterId={params?.chapterId}
              courseId={params?.courseId}
              nextChapterId={nextChapter?.id}
              // isCompleted={!!userProgress?.isCompleted}
              isCompleted={false}

            />
          </div>
          <Separator />
          <div>
            <Preview value={chapter?.description!} />
          </div>
          {!!attachments?.length && (
            <>
              <Separator />
              <div className="p-4">
                {attachments.map((attachment) => (
                  <a
                    href={attachment.url}
                    target="_blank"
                    key={attachment.id}
                    className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                  >
                    <File />
                    <p className="line-clamp-1">{attachment.name}</p>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;
