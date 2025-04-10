import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Định nghĩa các route không cần bảo vệ
const publicRoutes = ['/sign-in', '/sign-up'];
// Định nghĩa các route cần bảo vệ
const protectedRoutes = ['/dashboard'];

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;
  const isLoggedIn = !!token;

  // Nếu người dùng đã đăng nhập và cố truy cập trang auth
  if (isLoggedIn && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Nếu người dùng chưa đăng nhập và cố truy cập trang protected
  if (!isLoggedIn && protectedRoutes.some(route => pathname.startsWith(route))) {
    const signInUrl = new URL('/sign-in', request.url);
    // Lưu URL hiện tại để redirect sau khi đăng nhập
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};