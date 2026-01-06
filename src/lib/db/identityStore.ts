import fs from "fs";
import path from "path";
import { Pool } from "pg";
import type { IdentityRequestRecord, IdentityStatus } from "@/domain/identity/types";

const globalStore = globalThis as typeof globalThis & {
  __identityStore?: Map<string, IdentityRequestRecord>;
  __identityStoreLoaded?: boolean;
  __identityDbPool?: Pool;
  __identityDbReady?: boolean;
};

const store = globalStore.__identityStore ?? new Map<string, IdentityRequestRecord>();
globalStore.__identityStore = store;

const shouldUseDatabase = () => Boolean(process.env.NETLIFY_DATABASE_URL);

const getPool = () => {
  if (!globalStore.__identityDbPool) {
    globalStore.__identityDbPool = new Pool({
      connectionString: process.env.NETLIFY_DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });
  }
  return globalStore.__identityDbPool;
};

const ensureSchema = async () => {
  if (globalStore.__identityDbReady) return;
  const pool = getPool();
  await pool.query(`
    create table if not exists identity_requests (
      request_id text primary key,
      payload jsonb not null,
      status text not null,
      info_required boolean not null default false,
      created_at timestamptz not null,
      updated_at timestamptz not null
    );
  `);
  globalStore.__identityDbReady = true;
};

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
  if (shouldUseDatabase()) return;
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
  if (shouldUseDatabase()) return;
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

export const saveIdentityRequest = async (record: IdentityRequestRecord): Promise<void> => {
  if (shouldUseDatabase()) {
    await ensureSchema();
    const pool = getPool();
    await pool.query(
      `
      insert into identity_requests (
        request_id,
        payload,
        status,
        info_required,
        created_at,
        updated_at
      )
      values ($1, $2, $3, $4, $5, $6)
      on conflict (request_id) do update
        set payload = excluded.payload,
            status = excluded.status,
            info_required = excluded.info_required,
            updated_at = excluded.updated_at
    `,
      [
        record.requestId,
        record,
        record.status,
        record.infoRequired ?? false,
        record.createdAt,
        record.updatedAt,
      ]
    );
    return;
  }

  loadFromDisk();
  store.set(record.requestId, record);
  persistToDisk();
};

export const getIdentityRequest = async (
  requestId: string
): Promise<IdentityRequestRecord | undefined> => {
  if (shouldUseDatabase()) {
    await ensureSchema();
    const pool = getPool();
    const result = await pool.query<{ payload: IdentityRequestRecord }>(
      "select payload from identity_requests where request_id = $1",
      [requestId]
    );
    return result.rows[0]?.payload;
  }

  loadFromDisk();
  return store.get(requestId);
};

export const updateIdentityStatus = async (
  requestId: string,
  status: IdentityStatus
): Promise<void> => {
  const record = await getIdentityRequest(requestId);
  if (!record) return;
  const updated = {
    ...record,
    status,
    infoRequired: record.infoRequired ?? false,
    updatedAt: new Date().toISOString(),
  };
  await saveIdentityRequest(updated);
};

export const listIdentityRequests = async (): Promise<IdentityRequestRecord[]> => {
  if (shouldUseDatabase()) {
    await ensureSchema();
    const pool = getPool();
    const result = await pool.query<{ payload: IdentityRequestRecord }>(
      "select payload from identity_requests order by created_at desc"
    );
    return result.rows.map((row) => row.payload as IdentityRequestRecord);
  }

  loadFromDisk();
  return Array.from(store.values());
};

export const markInfoRequired = async (requestId: string, value: boolean): Promise<void> => {
  const record = await getIdentityRequest(requestId);
  if (!record) return;
  await saveIdentityRequest({
    ...record,
    infoRequired: value,
    updatedAt: new Date().toISOString(),
  });
};
