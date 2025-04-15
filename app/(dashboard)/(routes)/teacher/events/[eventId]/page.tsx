import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
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
const EventIdPage = async ({ params }: { params: { eventId: string } }) => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return redirect("/");
  }

  const event = await db.event.findUnique({
    where: {
      id: params.eventId,
    },
  });

  if (!event) {
    return redirect("/teacher/events?error=event-not-found");
  }

  const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "MANAGER";
  const isOwner = event.userId === userId;

  if (!isAdmin && !isOwner) {
    return redirect("/teacher/events?error=unauthorized");
  }

  const requiredFields = [
    event.title,
    event.name,
    event.description,
    event.imageUrl,
    event.link,
    event.date,
    event.host,
    event.author,
    event.address,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!event.isPublished && (
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
            isPublished={event.isPublished}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Tuỳ chỉnh sự kiện của bạn</h2>
            </div>
            <TitleForm initialData={event} courseId={event.id} />
            <NameForm initialData={event} courseId={event.id} />
            <DescriptionForm initialData={event} courseId={event.id} />
            <ImageForm initialData={event} courseId={event.id} />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Chi tiết sự kiện</h2>
              </div>
              <HostForm initialData={event} courseId={event.id} />
              <AuthorForm initialData={event} courseId={event.id} />
              <LinkForm initialData={event} courseId={event.id} />
              <AddressForm initialData={event} courseId={event.id} />
              {/* <DateForm initialData={event} eventId={event.id} /> */}
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventIdPage;
