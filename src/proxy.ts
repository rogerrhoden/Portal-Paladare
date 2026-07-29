import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionCookie } from "@/lib/session";

export const config = {
  // Protege tudo (dashboard e /equipe) exceto login, rotas de API e assets internos do Next.
  matcher: ["/((?!api/|_next/|login|favicon.ico).*)"],
};

export async function proxy(req: NextRequest) {
  const cookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const valid = await verifySessionCookie(cookie);

  if (!valid) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    url.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
