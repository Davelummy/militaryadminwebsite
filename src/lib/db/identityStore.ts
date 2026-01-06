import type { IdentityRequestRecord, IdentityStatus } from "@/domain/identity/types";

const globalStore = globalThis as typeof globalThis & {
  __identityStore?: Map<string, IdentityRequestRecord>;
};

const store = globalStore.__identityStore ?? new Map<string, IdentityRequestRecord>();
globalStore.__identityStore = store;

export const saveIdentityRequest = (record: IdentityRequestRecord) => {
  store.set(record.requestId, record);
};

export const getIdentityRequest = (requestId: string) => store.get(requestId);

export const updateIdentityStatus = (requestId: string, status: IdentityStatus) => {
  const record = store.get(requestId);
  if (!record) return;
  const updated = {
    ...record,
    status,
    infoRequired: record.infoRequired ?? false,
    updatedAt: new Date().toISOString(),
  };
  store.set(requestId, updated);
};

export const listIdentityRequests = () => Array.from(store.values());

export const markInfoRequired = (requestId: string, value: boolean) => {
  const record = store.get(requestId);
  if (!record) return;
  store.set(requestId, {
    ...record,
    infoRequired: value,
    updatedAt: new Date().toISOString(),
  });
};
