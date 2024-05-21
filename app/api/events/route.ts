import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";

export async function POST(
  req: Request,
) {
  try {
    const { userId } = auth();
    const { title } = await req.json();

    if (!userId || !isTeacher(userId)) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const event = await db.event.create({
        data: {
            title,
            userId,
            // Add other missing properties here
        }
    });

    return NextResponse.json(event);
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}