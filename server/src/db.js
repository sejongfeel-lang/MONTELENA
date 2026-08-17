import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data');
const DATA_FILE = join(DATA_DIR, 'store.json');

const EMPTY_STORE = {
  keywords: [],
  issues: [],
  settings: { slackWebhook: '', notifyOnNegative: true },
};

function ensureStore() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  if (!existsSync(DATA_FILE)) writeFileSync(DATA_FILE, JSON.stringify(EMPTY_STORE, null, 2));
}

export function readStore() {
  ensureStore();
  const raw = readFileSync(DATA_FILE, 'utf-8');
  try {
    const store = JSON.parse(raw);
    if (!store.settings) store.settings = { ...EMPTY_STORE.settings };
    return store;
  } catch {
    return structuredClone(EMPTY_STORE);
  }
}

export function writeStore(store) {
  ensureStore();
  writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
}
