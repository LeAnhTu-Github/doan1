// store.ts
import { db } from "@/lib/db";
import { getCourses } from "@/actions/get-courses";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { courseRegister } from "@prisma/client";
interface SearchParams {
    title: string;
    categoryId: string;
}

export async function storeDashboard(searchParams: SearchParams) {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    if (!userId) return { user: null };

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) return { user: null, redirect: true };

    const [events, categories, regisUsers, regisEvents, courses] = await Promise.all([
        db.event.findMany({ orderBy: { createdAt: "desc" } }),
        db.category.findMany({ orderBy: { name: "asc" } }),
        db.courseRegister.findMany({ where: { userId } }),
        db.userRegister.findMany({ orderBy: { createdAt: "desc" } }),
        getCourses({ userId, ...searchParams }),
    ]);

    return {
        user,
        events,
        categories,
        regis: regisUsers.length > 0 ? regisUsers[0] : {} as courseRegister,
        regisEvents,
        courses,
    };
}
