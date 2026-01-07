import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const getSupabaseConfig = () => {
  const url = process.env.SUPABASE_URL || "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "";
  const publicBaseUrl = process.env.SUPABASE_PUBLIC_BASE_URL || "";

  if (!url || !serviceRoleKey || !bucket) {
    return null;
  }

  return { url, serviceRoleKey, bucket, publicBaseUrl };
};

const sanitizeFilename = (name: string) =>
  name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);

export async function POST(request: Request) {
  const supabaseConfig = getSupabaseConfig();
  if (!supabaseConfig) {
    return NextResponse.json(
      { message: "Upload not configured." },
      { status: 400 }
    );
  }

  const body = (await request.json()) as { filename?: string; contentType?: string };
  if (!body.filename) {
    return NextResponse.json({ message: "Missing upload metadata." }, { status: 400 });
  }
  const contentType = body.contentType && body.contentType.includes("/")
    ? body.contentType
    : "application/octet-stream";

  const key = `identity-uploads/${crypto.randomUUID()}-${sanitizeFilename(body.filename)}`;

  if (supabaseConfig) {
    const supabase = createClient(supabaseConfig.url, supabaseConfig.serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await supabase.storage
      .from(supabaseConfig.bucket)
      .createSignedUploadUrl(key, { upsert: false });
    if (error || !data?.signedUrl) {
      return NextResponse.json(
        { message: "Supabase upload not configured." },
        { status: 400 }
      );
    }
    const publicUrl = supabaseConfig.publicBaseUrl
      ? `${supabaseConfig.publicBaseUrl}/${key}`
      : null;
    return NextResponse.json({ url: data.signedUrl, key, publicUrl, provider: "supabase" });
  }

  return NextResponse.json(
    { message: "Upload not configured." },
    { status: 400 }
  );
}
