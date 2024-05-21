import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";

import { db } from "@/lib/db";
import { IconBadge } from "@/components/icon-badge";
import { Banner } from "@/components/banner";
import { TitleForm } from "./_components/title-form";
import { NameForm } from "./_components/name-form";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";
import { HostForm } from "./_components/host-form";
import { AuthorForm } from "./_components/author-form";
import { LinkForm } from "./_components/link-form";
import { AddressForm } from "./_components/address-form";

import { Actions } from "./_components/actions";
import { DateForm } from "./_components/date-form";
const CourseIdPage = async ({ params }: { params: { eventId: string } }) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const course = await db.event.findUnique({
    where: {
      id: params.eventId,
      userId,
    },
  });

  if (!course) {
    return redirect("/");
  }

  const requiredFields = [
    course.title,
    course.name,
    course.description,
    course.imageUrl,
    course.link,
    course.date,
    course.host,
    course.author,
    course.address,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!course.isPublished && (
        <Banner label="This event is unpublished. It will not be visible to the students." />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Event setup</h1>
            <span className="text-sm text-slate-700">
              Complete all fields {completionText}
            </span>
          </div>
          <Actions
            disabled={!isComplete}
            courseId={params.eventId}
            isPublished={course.isPublished}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Tuỳ chỉnh sự kiện của bạn</h2>
            </div>
            <TitleForm initialData={course} courseId={course.id} />
            <NameForm initialData={course} courseId={course.id} />
            <DescriptionForm initialData={course} courseId={course.id} />
            <ImageForm initialData={course} courseId={course.id} />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Chi tiết sự kiện</h2>
              </div>
              <HostForm initialData={course} courseId={course.id} />
              <AuthorForm initialData={course} courseId={course.id} />
              <LinkForm initialData={course} courseId={course.id} />
              <AddressForm initialData={course} courseId={course.id} />
              <DateForm initialData={course} courseId={course.id} />
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseIdPage;
