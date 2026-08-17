import type { IssueItem, KeywordCategory } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8787';

export interface HealthStatus {
  ok: boolean;
  naverConfigured: boolean;
  anthropicConfigured: boolean;
}

export interface BackendKeyword {
  id: string;
  folderId: string;
  folderName: string;
  name: string;
  category: KeywordCategory;
  synonyms: string[];
  excludeWords: string[];
  createdAt: string;
}

export interface CrawlResult {
  added: number;
  errors: string[];
  issues: IssueItem[];
}

async function safeFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { 'content-type': 'application/json', ...(init?.headers ?? {}) },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body?.error ?? `요청 실패 (${res.status})`);
  }
  return body as T;
}

export async function checkHealth(): Promise<HealthStatus | null> {
  try {
    return await safeFetch<HealthStatus>('/api/health');
  } catch {
    return null;
  }
}

export function createKeyword(payload: {
  folderId: string;
  folderName: string;
  name: string;
  category: KeywordCategory;
  synonyms: string[];
  excludeWords: string[];
}): Promise<BackendKeyword> {
  return safeFetch<BackendKeyword>('/api/keywords', { method: 'POST', body: JSON.stringify(payload) });
}

export function crawlKeyword(keywordId: string): Promise<CrawlResult> {
  return safeFetch<CrawlResult>(`/api/keywords/${keywordId}/crawl`, { method: 'POST' });
}

export function fetchIssues(keywordId: string): Promise<IssueItem[]> {
  return safeFetch<IssueItem[]>(`/api/keywords/${keywordId}/issues`);
}

export function listKeywords(): Promise<BackendKeyword[]> {
  return safeFetch<BackendKeyword[]>('/api/keywords');
}

export function updateKeyword(
  keywordId: string,
  payload: { name?: string; category?: KeywordCategory; synonyms?: string[]; excludeWords?: string[] },
): Promise<BackendKeyword> {
  return safeFetch<BackendKeyword>(`/api/keywords/${keywordId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function deleteKeyword(keywordId: string): Promise<void> {
  return safeFetch<void>(`/api/keywords/${keywordId}`, { method: 'DELETE' });
}

export interface AppSettings {
  slackWebhook: string;
  notifyOnNegative: boolean;
}

export function fetchSettings(): Promise<AppSettings> {
  return safeFetch<AppSettings>('/api/settings');
}

export function saveSettings(payload: Partial<AppSettings>): Promise<AppSettings> {
  return safeFetch<AppSettings>('/api/settings', { method: 'PUT', body: JSON.stringify(payload) });
}
