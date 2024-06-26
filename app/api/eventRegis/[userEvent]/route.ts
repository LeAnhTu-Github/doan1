
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";


export async function DELETE(
  req: Request,
  { params }: { params: { userEvent: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const deletedCourse = await db.userRegister.delete({
      where: {
        id: params.userEvent,
      },
    });

    return NextResponse.json(deletedCourse);
  } catch (error) {
    console.log("[EVENTS_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
export async function PATCH(
  req: Request,
  { params }: { params: { userEvent: string } }
) {
  try {
    const { userId } = auth();
    const { userEvent } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.userRegister.update({
      where: {
        id: userEvent,
      },
      data: {
        ...values,
      }
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSE_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}