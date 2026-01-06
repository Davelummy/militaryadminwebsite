import { NextResponse } from "next/server";
import crypto from "crypto";
import { HttpRequest } from "@smithy/protocol-http";
import { SignatureV4 } from "@smithy/signature-v4";
import { Sha256 } from "@aws-crypto/sha256-js";

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

  const endpointUrl = new URL(config.endpoint);
  const signer = new SignatureV4({
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
    region: "auto",
    service: "s3",
    sha256: Sha256,
  });

  const signedRequest = new HttpRequest({
    protocol: endpointUrl.protocol,
    hostname: endpointUrl.hostname,
    method: "PUT",
    path: `/${config.bucket}/${key}`,
    headers: {
      host: endpointUrl.hostname,
      "content-type": body.contentType,
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
  const publicUrl = config.publicBaseUrl ? `${config.publicBaseUrl}/${key}` : null;

  return NextResponse.json({ url, key, publicUrl });
}
