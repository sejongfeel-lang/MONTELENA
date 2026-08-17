import { readStore } from './db.js';
import { crawlKeywordById } from './crawler.js';
import { naverConfigured } from './naver.js';

const INTERVAL_MS = 15 * 60 * 1000; // 15분마다 — 실제 서비스에 준하는 주기

// 브라우저/프론트엔드 상태와 무관하게, 서버가 살아있는 동안 등록된 모든 키워드를
// 주기적으로 재수집합니다. Render/Railway 같은 상시 구동 호스팅에 배포하면
// 컴퓨터를 꺼도 계속 동작합니다.
async function tick() {
  if (!naverConfigured()) return;
  const { keywords } = readStore();
  for (const keyword of keywords) {
    try {
      await crawlKeywordById(keyword.id);
    } catch (err) {
      console.error(`[scheduler] ${keyword.name} 수집 실패:`, err.message);
    }
    // 네이버 API 레이트리밋을 배려해 키워드 사이에 짧게 간격을 둡니다.
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}

export function startScheduler() {
  console.log(`[scheduler] 백그라운드 자동 수집 시작 (${INTERVAL_MS / 60000}분 주기)`);
  tick();
  setInterval(tick, INTERVAL_MS);
}
