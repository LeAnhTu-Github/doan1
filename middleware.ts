import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Định nghĩa các route không cần bảo vệ
const publicRoutes = ['/sign-in', '/sign-up'];
// Định nghĩa các route cần bảo vệ
const protectedRoutes = ['/dashboard'];

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  
  // Nếu chưa đăng nhập và không phải đang ở trang sign-in
  if (!token && request.nextUrl.pathname !== "/sign-in") {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const { pathname } = request.nextUrl;
  const isLoggedIn = !!token;

  // Nếu người dùng đã đăng nhập và cố truy cập trang auth
  if (isLoggedIn && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
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

// Áp dụng middleware cho tất cả các route trừ api và các static files
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