import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl;
  const { pathname } = url;

  if (pathname.startsWith(`/api/`)) {
    const ref = req.headers.get("referer");
    if (
      !ref?.includes(process.env.APP_URL) &&
      !ref?.includes(process.env.APP_URL1) &&
      !ref?.includes(process.env.APP_URL2)
    ) {
      return NextResponse.json({ message: "Not allowed" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|fonts|examples|svg|[\\w-]+\\.\\w+).*)"],
};
