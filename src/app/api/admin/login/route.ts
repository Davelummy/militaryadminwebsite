import { NextResponse } from "next/server";
import crypto from "crypto";

type AdminLoginPayload = {
  key: string;
};

const hashKey = (value: string) => {
  return crypto.createHash("sha256").update(value).digest("hex");
};

export async function POST(request: Request) {
  const body = (await request.json()) as AdminLoginPayload;
  const adminKey = process.env.ADMIN_PORTAL_KEY || "";

  if (!adminKey || body.key !== adminKey) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const response = NextResponse.json({ message: "Authorized." });
  response.cookies.set("admin_access", hashKey(adminKey), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  return response;
}
