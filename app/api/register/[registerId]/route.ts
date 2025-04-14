import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";


export async function DELETE(
  req: Request,
  { params }: { params: { registerId: string } }
) {
  try {
    const { registerId } = params;
    await db.user.delete({
      where: { id: registerId },
    });
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { registerId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const { registerId } = params;
    const body = await req.json();
    
    // Nếu đang cập nhật role
    if (body.role) {
      // Kiểm tra xem người dùng hiện tại có phải là ADMIN không
      if (session?.user?.role !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
      }

      // Kiểm tra role hợp lệ
      if (!["ADMIN", "MANAGER", "USER"].includes(body.role)) {
        return new NextResponse("Invalid role", { status: 400 });
      }

      const updatedUser = await db.user.update({
        where: { id: registerId },
        data: { role: body.role },
      });

      return NextResponse.json(updatedUser);
    }

    // Xử lý cập nhật thông tin khác
    const updatedUser = await db.user.update({
      where: { id: registerId },
      data: {
        masv: body.masv,
        name: body.name,
        class: body.class,
        department: body.department,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[USER_UPDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}