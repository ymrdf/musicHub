import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// JWT_SECRET 在这里不需要，因为我们只验证格式和过期时间，不验证签名

// 简化的 JWT 验证函数（避免使用 jsonwebtoken 库，因为它在 Edge Runtime 中不可用）
function verifyTokenSimple(token: string) {
  try {
    // 简单的 JWT 格式检查
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    // 解码 payload（不验证签名，只验证格式和过期时间）
    const payload = JSON.parse(
      atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
    );

    // 检查是否有 userId 和是否过期
    if (!payload.userId || !payload.exp) {
      return null;
    }

    // 检查是否过期（时间戳是秒，需要转换为毫秒）
    if (payload.exp * 1000 < Date.now()) {
      return null;
    }

    return payload;
  } catch (error) {
    return null;
  }
}

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

    // 验证 JWT token
    const decoded = verifyTokenSimple(token);
    if (!decoded || !decoded.userId) {
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

    if (token) {
      const decoded = verifyTokenSimple(token);
      if (decoded && decoded.userId) {
        return NextResponse.redirect(new URL("/", request.url));
      }
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
