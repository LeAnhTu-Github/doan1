import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";

export async function POST(
  req: Request,
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const values = await req.json();
    const event = await db.courseRegister.create({
        data: {
            userId,
            isRegister: true,
            ...values,
            // Add other missing properties here
        }
    });

    return NextResponse.json(event);
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}