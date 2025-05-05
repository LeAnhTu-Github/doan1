import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { userId: string; courseId: string } }
) {
  try {
    // Xoá bản ghi đăng ký khoá học
    await db.courseRegister.deleteMany({
      where: {
        userId: params.userId,
        courseId: params.courseId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Xoá thất bại" }, { status: 500 });
  }
}