import { NextResponse } from "next/server";
import { listIdentityRequests } from "@/lib/db/identityStore";
import { decryptSensitive } from "@/lib/security/encryption";

const maskSsn = (value: string) => {
  const digits = value.replace(/\D/g, "");
  const last4 = digits.slice(-4).padStart(4, "_");
  return `***-**-${last4}`;
};

const maskDob = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "****-**-**";
  const year = date.getUTCFullYear().toString();
  const maskedYear = `${year.slice(0, 2)}**`;
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${maskedYear}-${month}-${day}`;
};

export async function GET(request: Request) {
  // LOGGING POLICY:
  // - Allowed: requestId, timestamps, status transitions.
  // - Forbidden: SSN, DOB, ID contents, address, or raw PII.
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const query = (searchParams.get("q") || "").toLowerCase();
  const page = Math.max(Number(searchParams.get("page") || 1), 1);
  const pageSize = Math.min(Math.max(Number(searchParams.get("pageSize") || 10), 5), 50);

  const filtered = listIdentityRequests().filter((record) => {
    const matchesStatus = status ? record.status === status : true;
    const matchesQuery = query
      ? [
          record.requestId,
          record.personal.firstName,
          record.personal.lastName,
          record.personal.email,
          record.serviceMember.name,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query)
      : true;
    return matchesStatus && matchesQuery;
  });

  const start = (page - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  const records = paged.map((record) => ({
    requestId: record.requestId,
    status: record.status,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    infoRequired: record.infoRequired ?? false,
    applicant: {
      firstName: record.personal.firstName,
      lastName: record.personal.lastName,
      email: record.personal.email,
      phone: record.personal.phone,
    },
    relationship: record.relationship.relationship,
    serviceMember: {
      name: record.serviceMember.name,
      branch: record.serviceMember.branch,
    },
    identity: {
      dob: maskDob(decryptSensitive(record.sensitive.encryptedDob)),
      ssn: maskSsn(decryptSensitive(record.sensitive.encryptedSsn)),
    },
    address: {
      street: "REDACTED",
      city: record.address.city,
      state: record.address.state,
      zip: record.address.zip,
    },
  }));

  return NextResponse.json({
    records,
    total: filtered.length,
    page,
    pageSize,
  });
}
