import { NextResponse } from "next/server";

function getProtectedPages(url) {
  if (
    url === "/" ||
    url === "/employees" ||
    url === "/members" ||
    url === "/basic-tools" ||
    url === "/1ti" ||
    url === "/industrial-organizations" ||
    url === "/group-organizations" ||
    url === "/passport-primary-organizations" ||
    url === "/register-bkut" ||
    url === "/reports" ||
    url === "/settings" ||
    url === "/statistical-information" ||
    url === "/team-contracts" ||
    url === "/members" ||
    url === "/profile"
  )
    return true;
  return false;
}

export function middleware(req) {
  const url = req.nextUrl;
  const { pathname } = url;

  // return NextResponse.redirect(new URL('/', req.url));

  if (pathname.startsWith(`/api/`)) {
    const ref = req.headers.get("referer");
    if (
      !ref?.includes(process.env.APP_URL) &&
      !ref?.includes(process.env.APP_URL1) &&
      !ref?.includes(process.env.APP_URL2)
    ) {
      return NextResponse.json({ message: "Not allowed" }, { status: 401 });
    }
  } else {
    const isAuthorized = req.cookies.get("token");
    if (isAuthorized && pathname === "/auth")
      return NextResponse.rewrite(new URL("/", req.url));
    if (!isAuthorized && getProtectedPages(pathname))
      return NextResponse.rewrite(new URL("/auth", req.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/((?!_next|fonts|examples|svg|[\\w-]+\\.\\w+).*)"],
};
