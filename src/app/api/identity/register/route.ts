import { NextResponse } from "next/server";
import crypto from "crypto";
import type { IdentityRequestPayload } from "@/domain/identity/types";
import { encryptSensitive } from "@/lib/security/encryption";
import { isValidDob, isValidEmail, isValidPhone, isValidSsn } from "@/lib/security/validation";
import { saveIdentityRequest, updateIdentityStatus } from "@/lib/db/identityStore";
import { verifyIdentityStub } from "@/services/identityVerificationService";

const assertEnv = () => {
  if (process.env.NODE_ENV === "production") {
    if (!process.env.ENCRYPTION_KEY) {
      throw new Error("Missing ENCRYPTION_KEY.");
    }
    if (!process.env.IDENTITY_VERIFICATION_API_BASE_URL) {
      throw new Error("Missing IDENTITY_VERIFICATION_API_BASE_URL.");
    }
  }
};

export async function POST(request: Request) {
  assertEnv();

  // LOGGING POLICY:
  // - Allowed: requestId, timestamps, status transitions.
  // - Forbidden: SSN, DOB, ID contents, address, or raw PII.
  const payload = (await request.json()) as IdentityRequestPayload;

  const errors: string[] = [];
  if (!payload.firstName?.trim()) errors.push("firstName");
  if (!payload.lastName?.trim()) errors.push("lastName");
  if (!isValidEmail(payload.email)) errors.push("email");
  if (!isValidPhone(payload.phone)) errors.push("phone");
  if (!payload.relationship?.trim()) errors.push("relationship");
  if (!payload.serviceMemberName?.trim()) errors.push("serviceMemberName");
  if (!payload.branch?.trim()) errors.push("branch");
  if (!isValidDob(payload.dob)) errors.push("dob");
  if (!isValidSsn(payload.ssn)) errors.push("ssn");
  if (!payload.street?.trim()) errors.push("street");
  if (!payload.city?.trim()) errors.push("city");
  if (!payload.state?.trim()) errors.push("state");
  if (!payload.zip?.trim()) errors.push("zip");
  if (!payload.idFront) errors.push("idFront");

  if (errors.length > 0) {
    return NextResponse.json(
      { message: "Invalid submission. Please review required fields.", errors },
      { status: 400 }
    );
  }

  const requestId = `SCF-${crypto.randomUUID()}`;
  const now = new Date().toISOString();

  saveIdentityRequest({
    requestId,
    status: "PENDING",
    infoRequired: false,
    createdAt: now,
    updatedAt: now,
    personal: {
      firstName: payload.firstName.trim(),
      lastName: payload.lastName.trim(),
      email: payload.email.trim(),
      phone: payload.phone.trim(),
    },
    relationship: {
      relationship: payload.relationship,
      connectionDescription: payload.connectionDescription?.trim() || undefined,
    },
    serviceMember: {
      name: payload.serviceMemberName.trim(),
      branch: payload.branch,
      rank: payload.rank?.trim() || undefined,
      unit: payload.unit?.trim() || undefined,
      region: payload.region?.trim() || undefined,
    },
    address: {
      street: payload.street.trim(),
      city: payload.city.trim(),
      state: payload.state.trim(),
      zip: payload.zip.trim(),
    },
    sensitive: {
      encryptedDob: encryptSensitive(payload.dob),
      encryptedSsn: encryptSensitive(payload.ssn),
    },
    documents: {
      idFront: payload.idFront,
      idBack: payload.idBack ?? null,
    },
  });

  const status = await verifyIdentityStub();
  updateIdentityStatus(requestId, status);

  return NextResponse.json({
    requestId,
    status,
    message: "Request received. Verification is pending.",
  });
}
