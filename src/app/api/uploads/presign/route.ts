import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { HttpRequest } from "@smithy/protocol-http";
import { SignatureV4 } from "@smithy/signature-v4";
import { Sha256 } from "@aws-crypto/sha256-js";

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

const getR2Config = () => {
  const accountId = process.env.R2_ACCOUNT_ID || "";
  const accessKeyId = process.env.R2_ACCESS_KEY_ID || "";
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || "";
  const bucket = process.env.R2_BUCKET_NAME || "";
  const endpoint = process.env.R2_ENDPOINT || (accountId
    ? `https://${accountId}.r2.cloudflarestorage.com`
    : "");
  const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL || "";

  if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !endpoint) {
    return null;
  }

  const normalizedEndpoint = endpoint.startsWith("https://")
    ? endpoint
    : endpoint.replace(/^http:\/\//, "https://");
  return { accessKeyId, secretAccessKey, bucket, endpoint: normalizedEndpoint, publicBaseUrl };
};

const sanitizeFilename = (name: string) =>
  name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);

export async function POST(request: Request) {
  const supabaseConfig = getSupabaseConfig();
  const r2Config = getR2Config();
  if (!supabaseConfig && !r2Config) {
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
      .createSignedUploadUrl(key, 300);
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

  const endpointUrl = new URL(r2Config.endpoint);
  const signer = new SignatureV4({
    credentials: {
      accessKeyId: r2Config.accessKeyId,
      secretAccessKey: r2Config.secretAccessKey,
    },
    region: "auto",
    service: "s3",
    sha256: Sha256,
  });

  const signedRequest = new HttpRequest({
    protocol: endpointUrl.protocol,
    hostname: endpointUrl.hostname,
    method: "PUT",
    path: `/${r2Config.bucket}/${key}`,
    headers: {
      host: endpointUrl.hostname,
      "content-type": contentType,
      "x-amz-content-sha256": "UNSIGNED-PAYLOAD",
    },
  });

  const signed = await signer.presign(signedRequest, { expiresIn: 300 });
  const query = new URLSearchParams();
  Object.entries(signed.query ?? {}).forEach(([name, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => query.append(name, item));
      return;
    }
    if (value !== undefined) {
      query.set(name, String(value));
    }
  });
  const url = `${signed.protocol}//${signed.hostname}${signed.path}?${query.toString()}`;
  const publicUrl = r2Config.publicBaseUrl ? `${r2Config.publicBaseUrl}/${key}` : null;

  return NextResponse.json({ url, key, publicUrl, provider: "r2" });
}
