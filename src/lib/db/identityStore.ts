import fs from "fs";
import path from "path";
import type { IdentityRequestRecord, IdentityStatus } from "@/domain/identity/types";

const globalStore = globalThis as typeof globalThis & {
  __identityStore?: Map<string, IdentityRequestRecord>;
  __identityStoreLoaded?: boolean;
};

const store = globalStore.__identityStore ?? new Map<string, IdentityRequestRecord>();
globalStore.__identityStore = store;

const getStorePath = () => {
  if (process.env.IDENTITY_STORE_PATH) {
    return process.env.IDENTITY_STORE_PATH;
  }
  if (process.env.NETLIFY || process.env.NODE_ENV === "production") {
    return "/tmp/militaryadmin-identity.json";
  }
  return path.join(process.cwd(), ".data", "identity.json");
};

const loadFromDisk = () => {
  if (globalStore.__identityStoreLoaded) return;
  globalStore.__identityStoreLoaded = true;
  const storePath = getStorePath();
  if (!fs.existsSync(storePath)) return;
  try {
    const raw = fs.readFileSync(storePath, "utf8");
    const items = JSON.parse(raw) as IdentityRequestRecord[];
    items.forEach((record) => store.set(record.requestId, record));
  } catch {
    // Ignore corrupt store; start fresh in memory.
  }
};

const persistToDisk = () => {
  const storePath = getStorePath();
  try {
    const dir = path.dirname(storePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(storePath, JSON.stringify(Array.from(store.values()), null, 2));
  } catch {
    // Ignore persistence errors in serverless environments.
  }
};

export const saveIdentityRequest = (record: IdentityRequestRecord) => {
  loadFromDisk();
  store.set(record.requestId, record);
  persistToDisk();
};

export const getIdentityRequest = (requestId: string) => {
  loadFromDisk();
  return store.get(requestId);
};

export const updateIdentityStatus = (requestId: string, status: IdentityStatus) => {
  loadFromDisk();
  const record = store.get(requestId);
  if (!record) return;
  const updated = {
    ...record,
    status,
    infoRequired: record.infoRequired ?? false,
    updatedAt: new Date().toISOString(),
  };
  store.set(requestId, updated);
  persistToDisk();
};

export const listIdentityRequests = () => {
  loadFromDisk();
  return Array.from(store.values());
};

export const markInfoRequired = (requestId: string, value: boolean) => {
  loadFromDisk();
  const record = store.get(requestId);
  if (!record) return;
  store.set(requestId, {
    ...record,
    infoRequired: value,
    updatedAt: new Date().toISOString(),
  });
  persistToDisk();
};
