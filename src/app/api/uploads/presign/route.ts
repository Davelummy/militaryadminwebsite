import { NextResponse } from "next/server";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

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

  return { accessKeyId, secretAccessKey, bucket, endpoint, publicBaseUrl };
};

const sanitizeFilename = (name: string) =>
  name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);

export async function POST(request: Request) {
  const config = getR2Config();
  if (!config) {
    return NextResponse.json(
      { message: "R2 upload not configured." },
      { status: 400 }
    );
  }

  const body = (await request.json()) as { filename?: string; contentType?: string };
  if (!body.filename || !body.contentType) {
    return NextResponse.json({ message: "Missing upload metadata." }, { status: 400 });
  }

  const key = `identity-uploads/${crypto.randomUUID()}-${sanitizeFilename(body.filename)}`;

  const client = new S3Client({
    region: "auto",
    forcePathStyle: true,
    endpoint: config.endpoint,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });

  const command = new PutObjectCommand({
    Bucket: config.bucket,
    Key: key,
    ContentType: body.contentType,
  });

  const url = await getSignedUrl(client, command, { expiresIn: 300 });
  const publicUrl = config.publicBaseUrl ? `${config.publicBaseUrl}/${key}` : null;

  return NextResponse.json({ url, key, publicUrl });
}
