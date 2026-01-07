import { NextResponse } from "next/server";

const REQUIRED_VARS = [
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "SUPABASE_STORAGE_BUCKET",
];

export async function GET() {
  const missing = REQUIRED_VARS.filter((name) => !process.env[name]);
  return NextResponse.json({
    missing,
    ok: missing.length === 0,
  });
}
