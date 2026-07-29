import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/lib/env";
import { createSessionCookieValue, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "@/lib/session";

function safeNext(next: FormDataEntryValue | null): string {
  const value = String(next ?? "/equipe");
  return value.startsWith("/") ? value : "/equipe";
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const password = String(form.get("password") ?? "");
  const next = safeNext(form.get("next"));

  if (password !== env.dashboardPassword) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    url.searchParams.set("next", next);
    url.searchParams.set("erro", "1");
    return NextResponse.redirect(url, { status: 303 });
  }

  const url = req.nextUrl.clone();
  url.pathname = next;
  url.search = "";
  const res = NextResponse.redirect(url, { status: 303 });
  res.cookies.set(SESSION_COOKIE_NAME, await createSessionCookieValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return res;
}
