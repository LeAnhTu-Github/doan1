import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: { contestId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Kiểm tra xem người dùng đã đăng ký chưa
    const existingRegistration = await db.contestParticipant.findFirst({
      where: {
        contestId: params.contestId,
        userId: userId,
      },
    });

    if (existingRegistration) {
      return new NextResponse("Bạn đã đăng ký cuộc thi này", { status: 400 });
    }

    // Tạo đăng ký mới
    await db.contestParticipant.create({
      data: {
        contestId: params.contestId,
        userId: userId,
      },
    });

    return NextResponse.json({ message: "Đăng ký thành công" });
  } catch (error) {
    console.error("[CONTEST_REGISTER]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}