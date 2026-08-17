import { randomUUID } from 'node:crypto';
import { readStore, writeStore } from './db.js';
import { naverConfigured, searchKeyword } from './naver.js';
import { analyzeIssue } from './sentiment.js';
import { notifySlack } from './slack.js';

// 키워드 하나를 실제로 크롤링합니다. 라우트 핸들러와 백그라운드 스케줄러가 공유하는 핵심 로직입니다.
export async function crawlKeywordById(keywordId) {
  const store = readStore();
  const keyword = store.keywords.find((k) => k.id === keywordId);
  if (!keyword) return { ok: false, status: 404, error: '키워드를 찾을 수 없습니다.' };

  if (!naverConfigured()) {
    return {
      ok: false,
      status: 412,
      error: 'NAVER_CLIENT_ID / NAVER_CLIENT_SECRET가 설정되지 않아 실제 수집을 실행할 수 없습니다.',
    };
  }

  let searchResult;
  try {
    searchResult = await searchKeyword(keyword.name, { display: 6 });
  } catch (err) {
    return { ok: false, status: 502, error: err.message };
  }

  const existingUrls = new Set(store.issues.filter((i) => i.keywordId === keyword.id).map((i) => i.url));
  const newIssues = [];

  for (const item of searchResult.items) {
    if (existingUrls.has(item.url)) continue;
    existingUrls.add(item.url);
    const analysis = await analyzeIssue(item.title, item.description);
    newIssues.push({
      id: randomUUID(),
      keywordId: keyword.id,
      source: item.source,
      date: item.date,
      time: new Date().toISOString().slice(11, 16),
      title: item.title,
      url: item.url,
      rawText: item.description,
      sentiment: analysis.sentiment,
      confidence: analysis.confidence,
      summaryBullets: analysis.summaryBullets,
      factors: analysis.factors,
      category: analysis.category,
      tags: analysis.tags,
      inflowChannel: item.source,
      isAd: false,
      impactLevels: [analysis.sentiment === 'positive' ? '좋음' : '나쁨'],
      analysisEngine: analysis.engine,
    });
  }

  store.issues.push(...newIssues);
  writeStore(store);

  const { settings } = store;
  if (settings?.notifyOnNegative && settings?.slackWebhook) {
    for (const issue of newIssues) {
      if (issue.sentiment === 'negative') {
        await notifySlack(settings.slackWebhook, { keywordName: keyword.name, issue });
      }
    }
  }

  return {
    ok: true,
    added: newIssues.length,
    errors: searchResult.errors,
    issues: store.issues.filter((i) => i.keywordId === keyword.id).sort((a, b) => (a.date < b.date ? 1 : -1)),
  };
}
