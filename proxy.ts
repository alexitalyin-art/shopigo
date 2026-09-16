import { auth } from "@/auth";

export const proxy = auth((request) => {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!request.auth?.user) {
      const loginUrl = new URL("/admin/login", request.url);

      loginUrl.searchParams.set("callbackUrl", pathname);

      return Response.redirect(loginUrl);
    }

    if (request.auth.user.role !== "admin") {
      return Response.redirect(new URL("/", request.url));
    }
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};