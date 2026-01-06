import { NextResponse } from "next/server";
import { getIdentityRequest } from "@/lib/db/identityStore";

export async function GET(request: Request) {
  // LOGGING POLICY:
  // - Allowed: requestId, timestamps, status transitions.
  // - Forbidden: SSN, DOB, ID contents, address, or raw PII.
  const { searchParams } = new URL(request.url);
  const requestId = searchParams.get("requestId");

  if (!requestId) {
    return NextResponse.json({ message: "Missing requestId." }, { status: 400 });
  }

  const record = getIdentityRequest(requestId);
  if (!record) {
    return NextResponse.json({ message: "Request not found." }, { status: 404 });
  }

  const statusMessage = {
    PENDING: record.infoRequired
      ? "Additional verification is required. Contact support to continue."
      : "Verification is in progress.",
    APPROVED: "Your request has been approved.",
    REJECTED: "Additional verification is required.",
  } as const;

  return NextResponse.json({
    requestId: record.requestId,
    status: record.status,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    message: statusMessage[record.status],
  });
}
