import { NextResponse } from "next/server";

const REQUIRED_VARS = [
  "R2_ACCOUNT_ID",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET_NAME",
  "R2_ENDPOINT",
];

export async function GET() {
  const missing = REQUIRED_VARS.filter((name) => !process.env[name]);
  return NextResponse.json({
    missing,
    ok: missing.length === 0,
  });
}
