import { NextResponse } from "next/server";
import { getIdentityRequest, markInfoRequired, updateIdentityStatus } from "@/lib/db/identityStore";
import type { IdentityStatus } from "@/domain/identity/types";

type AdminUpdatePayload = {
  requestId: string;
  status: IdentityStatus;
  infoRequired?: boolean;
};

export async function POST(request: Request) {
  // LOGGING POLICY:
  // - Allowed: requestId, timestamps, status transitions.
  // - Forbidden: SSN, DOB, ID contents, address, or raw PII.
  const payload = (await request.json()) as AdminUpdatePayload;

  if (!payload.requestId || !payload.status) {
    return NextResponse.json({ message: "Missing requestId or status." }, { status: 400 });
  }

  const record = getIdentityRequest(payload.requestId);
  if (!record) {
    return NextResponse.json({ message: "Request not found." }, { status: 404 });
  }

  updateIdentityStatus(payload.requestId, payload.status);
  if (typeof payload.infoRequired === "boolean") {
    markInfoRequired(payload.requestId, payload.infoRequired);
  }

  return NextResponse.json({
    requestId: payload.requestId,
    status: payload.status,
    infoRequired: payload.infoRequired ?? false,
    message: "Status updated.",
  });
}
