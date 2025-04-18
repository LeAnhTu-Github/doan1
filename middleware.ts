import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Định nghĩa các route không cần bảo vệ
const publicRoutes = ['/sign-in', '/sign-up'];
// Định nghĩa các route cần bảo vệ
const protectedRoutes = ['/teacher/*'];

const DEFAULT_LOGIN_REDIRECT = "/"; // Trang mặc định sau khi đăng nhập

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET 
  });
  const { pathname } = request.nextUrl;
  // const isLoggedIn = !!token;
  
  // // Nếu đã đăng nhập và đang ở trang auth (sign-in, sign-up)
  // if (isLoggedIn && publicRoutes.includes(pathname)) {
  //   return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, request.url));
  // }

  // // Nếu chưa đăng nhập và cố truy cập route khác ngoài public routes
  // if (!isLoggedIn && !publicRoutes.includes(pathname) && pathname !== '/') {
  //   const signInUrl = new URL('/sign-in', request.url);
  //   signInUrl.searchParams.set('callbackUrl', pathname);
  //   return NextResponse.redirect(signInUrl);
  // }

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
     * - images (local images)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};