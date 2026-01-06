import { NextResponse } from "next/server";
import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import crypto from "crypto";

const getR2Config = () => {
  const accountId = process.env.R2_ACCOUNT_ID || "";
  const accessKeyId = process.env.R2_ACCESS_KEY_ID || "";
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || "";
  const bucket = process.env.R2_BUCKET_NAME || "";
  const endpoint = process.env.R2_ENDPOINT || (accountId
    ? `https://${accountId}.r2.cloudflarestorage.com`
    : "");

  if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !endpoint) {
    return null;
  }

  return { accessKeyId, secretAccessKey, bucket, endpoint };
};

export async function POST() {
  const config = getR2Config();
  if (!config) {
    return NextResponse.json(
      { message: "R2 upload not configured." },
      { status: 400 }
    );
  }

  const client = new S3Client({
    region: "auto",
    forcePathStyle: true,
    endpoint: config.endpoint,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });

  const key = `identity-uploads/healthcheck-${crypto.randomUUID()}.txt`;
  try {
    await client.send(
      new PutObjectCommand({
        Bucket: config.bucket,
        Key: key,
        Body: "healthcheck",
        ContentType: "text/plain",
      })
    );
    await client.send(
      new DeleteObjectCommand({
        Bucket: config.bucket,
        Key: key,
      })
    );
  } catch (error) {
    return NextResponse.json(
      { message: "R2 upload failed.", error: (error as Error).message },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "R2 upload ok." });
}
