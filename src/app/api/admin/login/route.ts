import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  getAdminSessionToken,
  isValidAdminCredentials,
} from "@/lib/admin-auth";

interface LoginBody {
  username?: string;
  password?: string;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as LoginBody | null;
  const username = body?.username?.trim() ?? "";
  const password = body?.password ?? "";

  if (!isValidAdminCredentials(username, password)) {
    return NextResponse.json({ detail: "Invalid username or password" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: getAdminSessionToken(),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return response;
}
