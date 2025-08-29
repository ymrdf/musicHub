import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 静态文件和 API 路由跳过中间件
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/uploads") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 需要认证的路径
  const protectedPaths = [
    "/works/new",
    "/works/edit",
    "/performances/new",
    "/profile",
    "/settings",
  ];

  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (isProtectedPath) {
    const token =
      request.cookies.get("token")?.value ||
      request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      // 未登录，重定向到登录页
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 简单的 token 验证
    if (!token.startsWith("demo-jwt-token")) {
      // token 无效，重定向到登录页
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 已登录用户访问认证页面时重定向到首页
  const authPaths = ["/auth/login", "/auth/register"];
  if (authPaths.includes(pathname)) {
    const token =
      request.cookies.get("token")?.value ||
      request.headers.get("authorization")?.replace("Bearer ", "");

    if (token && token.startsWith("demo-jwt-token")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
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
     * - uploads (uploaded files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|uploads).*)",
  ],
};
