import { useSyncExternalStore } from 'react';
import type { IssueItem } from '../types';
import { ALL_KEYWORDS, ISSUES_BY_KEYWORD } from './mockData';

type Listener = () => void;

const EMPTY: IssueItem[] = [];

const liveIssues = new Map<string, IssueItem[]>();
const backendKeywordIds = new Set<string>();
const listeners = new Set<Listener>();
let allIssuesCache: IssueItem[] | null = null;

function emit() {
  allIssuesCache = null;
  listeners.forEach((l) => l());
}

export function setLiveIssues(keywordId: string, issues: IssueItem[]) {
  liveIssues.set(keywordId, issues);
  emit();
}

// 백엔드에 실제로 등록된(=실시간 자동 수집 대상인) 키워드를 표시합니다.
// 데모 목업 키워드는 여기 포함되지 않아 '실시간'이 아님을 UI에서 구분할 수 있습니다.
export function markBackendKeyword(keywordId: string) {
  if (!backendKeywordIds.has(keywordId)) {
    backendKeywordIds.add(keywordId);
    emit();
  }
}

export function isBackendKeyword(keywordId: string): boolean {
  return backendKeywordIds.has(keywordId);
}

export function useIsBackendKeyword(keywordId: string): boolean {
  return useSyncExternalStore(subscribe, () => isBackendKeyword(keywordId));
}

export function issuesFor(keywordId: string): IssueItem[] {
  return liveIssues.get(keywordId) ?? ISSUES_BY_KEYWORD[keywordId] ?? EMPTY;
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useIssuesFor(keywordId: string): IssueItem[] {
  return useSyncExternalStore(subscribe, () => issuesFor(keywordId));
}

function getAllIssuesSnapshot(): IssueItem[] {
  if (allIssuesCache === null) {
    allIssuesCache = ALL_KEYWORDS.flatMap((k) => issuesFor(k.id)).sort((a, b) => (a.date < b.date ? 1 : -1));
  }
  return allIssuesCache;
}

export function useAllIssues(): IssueItem[] {
  return useSyncExternalStore(subscribe, getAllIssuesSnapshot);
}
