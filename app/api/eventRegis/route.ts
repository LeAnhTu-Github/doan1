import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";

export async function POST(
  req: Request,
) {
  try {
    const { userId } = auth();
    const users = await db.user.findMany(
        {
            where: {
            id: userId ?? undefined, // Provide a default value or filtering option when userId is null
            },
        }
    );
    const user = users[0];
    const { question, eventId }= await req.json();
    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.userRegister.create({
      data: {
        userId: user?.id,
        question: question,
        eventId: eventId,
        masv: user?.masv,
        name: user?.name,
        email: user?.email,
        class: user?.class,
      }
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}