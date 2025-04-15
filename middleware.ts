import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Định nghĩa các route không cần bảo vệ
const publicRoutes = ['/sign-in', '/sign-up'];
// Định nghĩa các route cần bảo vệ
const protectedRoutes = ['/dashboard'];

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;
  const isLoggedIn = !!token;
  
  // Cho phép truy cập các route công khai mà không cần redirect
  if (publicRoutes.includes(pathname)) {
    // Nếu đã đăng nhập, redirect về trang chủ
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    // Nếu chưa đăng nhập, cho phép truy cập
    return NextResponse.next();
  }

  // Kiểm tra các route được bảo vệ
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!isLoggedIn) {
      const signInUrl = new URL('/sign-in', request.url);
      signInUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Nếu chưa đăng nhập và không phải route công khai
  if (!isLoggedIn && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
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