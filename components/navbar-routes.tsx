"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SearchInput } from "./search-input";
import UserButton from "./user-account-nav";

export const NavbarRoutes = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isTeacherUser = session?.user?.role === "ADMIN" || session?.user?.role === "MANAGER";
  
  const isTeacherPage = pathname?.startsWith("/teacher");
  const isCoursePage = pathname?.includes("/courses");
  const isSearchPage = pathname === "/search";

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="flex gap-x-2 ml-auto">
        {isTeacherPage || isCoursePage ? (
          <Link href="/">
            <Button size="sm" variant="ghost">
              <LogOut className="h-4 w-4 mr-2" />
              Thoát
            </Button>
          </Link>
        ) : isTeacherUser ? (
          <Link href="/teacher/courses">
            <Button size="lg" variant="ghost">
              Chế độ giáo viên
            </Button>
          </Link>
        ) : null}
        <UserButton />
      </div>
    </>
  );
};
