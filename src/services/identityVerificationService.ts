import type { IdentityStatus } from "@/domain/identity/types";

const API_BASE = process.env.IDENTITY_VERIFICATION_API_BASE_URL || "";

export const verifyIdentityStub = async (): Promise<IdentityStatus> => {
  // WARNING: Prototype only. Replace with DoD secure endpoint when provided.
  // Use mutual TLS / signed tokens / secure networking as required.
  void API_BASE;
  return "PENDING";
};
