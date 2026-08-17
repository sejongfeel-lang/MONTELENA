import type {
  ChannelDef,
  FolderNode,
  InsightData,
  IssueItem,
  KeywordCategory,
  KeywordNode,
  TrendPoint,
} from '../types';

export const CHANNELS: ChannelDef[] = [
  { id: 'naver-news', label: '네이버 뉴스' },
  { id: 'naver-blog', label: '네이버 블로그' },
  { id: 'naver-cafe', label: '네이버 카페' },
  { id: 'youtube', label: '유튜브' },
  { id: 'instagram', label: '인스타그램' },
  { id: 'x', label: 'X(트위터)' },
  { id: 'dc', label: '디시인사이드' },
  { id: 'bobae', label: '보배드림' },
  { id: 'theqoo', label: '더쿠' },
  { id: 'ppomppu', label: '뽐뿌' },
];

const DEFAULT_CHANNELS = CHANNELS.filter((c) => c.id !== 'ppomppu').map((c) => c.id);

function kw(
  id: string,
  name: string,
  totalIssues = 0,
  positive = 0,
  negative = 0,
  category: KeywordCategory = '브랜드',
  synonyms: string[] = [],
  excludeWords: string[] = [],
): KeywordNode {
  return { id, name, totalIssues, positive, negative, channels: DEFAULT_CHANNELS, category, synonyms, excludeWords };
}

export const FOLDERS: FolderNode[] = [
  {
    id: 'mg-dongbu',
    name: 'MG 동부',
    keywords: [
      kw('olympic-cms', '올림픽 CMS 교과'),
      kw('bundang-cms', '분당 CMS 교과'),
      kw('daechi-cms', '대치 CMS 교과'),
      kw('seocho-cms', '서초 CMS 교과'),
    ],
  },
  {
    id: 'mg-seobu',
    name: 'MG 서부',
    keywords: [
      kw('junggye-cms', '중계 CMS 교과', 0, 0, 0, '브랜드', [
        '중계 CMS교과관',
        '중계CMS 교과관',
        '중계 씨엠에스 교과관',
        '중계 CMS 교과관',
        '중계 CMS영재관',
        '중계 CMS 영재관',
      ]),
      kw('mokdong-cms-w', '목동 CMS 교과W'),
      kw('mapo-cms', '마포 CMS 교과관'),
      kw('gwanak-cms', '관악 CMS 교과관'),
      kw('bucheon-cms', '부천 CMS 교과관'),
      kw('ilsan-cms', '일산 CMS 교과관'),
      kw('songdo-cms', '송도 CMS 교과관'),
      kw('pyeongchon-cms', '평촌 CMS 교과관'),
      kw('mokdong-cms-central', '목동 CMS 교과센트럴관'),
    ],
  },
  {
    id: 'mt-seobu',
    name: 'MT 서부',
    keywords: [
      kw('mokdong-thinking', '목동 CMS 사고력'),
      kw('mokdong-central-thinking', '목동센트럴 CMS 사고력'),
      kw('junggye-thinking', '중계 CMS 사고력'),
      kw('sejong-thinking', '세종 CMS 사고력'),
      kw('ilsan-thinking', '일산 CMS 사고력'),
      kw('dongjak-thinking', '동작 CMS 사고력'),
      kw('songdo-thinking', '송도 CMS 사고력'),
      kw('sanbon-thinking', '산본 CMS 사고력'),
      kw('bucheon-thinking', '부천 CMS 사고력'),
      kw('mapo-thinking', '마포 CMS 사고력'),
    ],
  },
  {
    id: 'mt-dongbu',
    name: 'MT 동부',
    keywords: [
      kw('seocho-thinking', '서초 CMS 사고력'),
      kw('bundang-sunae-thinking', '분당수내 CMS 사고력'),
      kw('wirye-thinking', '위례 CMS 사고력'),
      kw('bundang-jeongja-thinking', '분당정자 CMS 사고력'),
      kw('olympic-thinking', '올림픽 CMS 사고력'),
      kw('seongdong-thinking', '성동 CMS 사고력'),
      kw('pyeongchon-thinking', '평촌 CMS 사고력'),
      kw('suji-thinking', '수지 CMS 사고력'),
      kw('gwangjin-thinking', '광진 CMS 사고력'),
      kw('jamsil-thinking', '잠실 CMS 사고력'),
      kw('apgujeong-thinking', '압구정 CMS 사고력'),
      kw('daechi-thinking', '대치 CMS 사고력'),
    ],
  },
  {
    id: 'hq',
    name: '본사',
    keywords: [
      kw('hq-cms-thinking', 'CMS 사고력'),
      kw('hq-cms-gifted', 'CMS 영재관'),
      kw('hq-cms', 'CMS'),
      kw('hq-noisy-kr', '노이지'),
      kw('hq-cqube', '씨큐브'),
      kw('hq-noisy-en', 'NOISY'),
    ],
  },
  {
    id: 'no-folder',
    name: '폴더 없음',
    keywords: [],
  },
];

// 실제 화면에서 "수집 중단됨" 상태로 표시되는 키워드
const PAUSED_KEYWORD_IDS = ['olympic-cms'];

export const ALL_KEYWORDS: KeywordNode[] = FOLDERS.flatMap((f) => f.keywords);
ALL_KEYWORDS.forEach((k) => {
  k.collecting = !PAUSED_KEYWORD_IDS.includes(k.id);
});

// 런타임에 등록/수정/삭제되는 키워드(백엔드 연동 키워드 등)를 위한 레지스트리.
// ALL_KEYWORDS는 데모용 목업 데이터라 정적이므로, 이 배열로 보완합니다.
const dynamicKeywords: KeywordNode[] = [];

export function registerKeyword(keyword: KeywordNode) {
  const idx = dynamicKeywords.findIndex((k) => k.id === keyword.id);
  if (idx >= 0) dynamicKeywords[idx] = keyword;
  else dynamicKeywords.push(keyword);
}

export function unregisterKeyword(id: string) {
  const idx = dynamicKeywords.findIndex((k) => k.id === id);
  if (idx >= 0) dynamicKeywords.splice(idx, 1);
}

export function findKeyword(id: string): KeywordNode | undefined {
  // dynamicKeywords가 우선입니다 — 데모 키워드를 수정하면 그 결과가 여기에 기록되므로,
  // 정적 시드 데이터보다 먼저 확인해야 수정 사항이 반영됩니다.
  return dynamicKeywords.find((k) => k.id === id) ?? ALL_KEYWORDS.find((k) => k.id === id);
}

export function pairedKeywordId(id: string): string {
  const folder = FOLDERS.find((f) => f.keywords.some((k) => k.id === id));
  if (!folder) return id;
  const idx = folder.keywords.findIndex((k) => k.id === id);
  const next = folder.keywords[(idx + 1) % folder.keywords.length];
  return next.id;
}

function hourLabels(): string[] {
  const labels: string[] = [];
  for (let h = 0; h < 24; h += 2) labels.push(`${String(h).padStart(2, '0')}:00`);
  return labels;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function trendFor(keywordId: string): TrendPoint[] {
  const rnd = seededRandom(keywordId.length * 37 + 11);
  return hourLabels().map((time, i) => ({
    time,
    positive: i === hourLabels().length - 2 ? Math.round(rnd() * 3) + 2 : Math.round(rnd() * 1.2),
    negative: Math.round(rnd() * 0.4),
  }));
}

const SOURCES = ['naver-cafe', 'naver-blog', 'instagram', 'naver-news', 'youtube', 'x'] as const;
const SOURCE_LABEL: Record<string, string> = {
  'naver-cafe': '네이버 카페',
  'naver-blog': '네이버 블로그',
  instagram: '인스타그램',
  'naver-news': '네이버 뉴스',
  youtube: '유튜브',
  x: 'X(트위터)',
};

interface IssueTemplate {
  title: string;
  factors: { label: string; detail: string }[];
  summary: string[];
  raw: string;
}

const POSITIVE_TEMPLATES: IssueTemplate[] = [
  {
    title: 'FIT 초등 수강 후기 남깁니다',
    factors: [
      { label: '체계', detail: '분기별 커리큘럼 구성이 체계적임' },
      { label: '만족', detail: '오답 학습 시스템에 대한 만족' },
      { label: '심화', detail: '최상위 교재로 심도있게 학습' },
    ],
    summary: [
      '분기 커리큘럼의 체계성에 대한 높은 만족감 확인',
      '최상위 교재 중심의 심화 학습으로 빠른 진도 적용',
      '오답 관리 시스템의 효과성에 대한 긍정적 평가',
    ],
    raw: '안녕하세요~ 이번 분기 FIT반 초등 수강 후기 남겨요. 커리큘럼이 분기별로 딱딱 짜여있어서 다음 진도가 뭔지 예상이 되니까 계획 세우기가 편하더라구요. 오답노트 시스템도 생각보다 꼼꼼하게 관리해주고, 교재도 최상위권 위주라 살짝 어렵긴 한데 그만큼 심화로 잘 가는 느낌입니다.',
  },
  {
    title: '수강 후기입니다 :) 만족도 높아요',
    factors: [
      { label: '무료', detail: '무료 클리닉반 제공' },
      { label: '꼼꼼', detail: '진도 관리가 꼼꼼함' },
      { label: '쉬움', detail: '선생님 설명 이해 쉬움' },
    ],
    summary: ['클리닉반 운영에 대한 학부모 만족', '진도 관리 세심함에 대한 신뢰 형성', '설명 방식이 학습자 눈높이에 맞음'],
    raw: '무료 클리닉반 운영해주셔서 부담 없이 보충 받을 수 있었어요. 진도표도 매주 챙겨주시고, 선생님이 눈높이에 맞춰 설명해주셔서 아이가 어렵지 않게 잘 따라가고 있습니다. 만족도 높습니다!',
  },
  {
    title: '파이널 실전반 개강 소식 공유',
    factors: [
      { label: '효율적', detail: '풀이법 훈련 프로그램' },
      { label: '강력', detail: '수업 효과에 대한 체감' },
    ],
    summary: ['실전 훈련 프로그램에 대한 기대감 확인', '단기간 성적 향상 사례 언급'],
    raw: '이번에 파이널 실전반 개강한다길래 신청했습니다. 풀이법 위주로 빠르게 훈련시켜주는 방식이라던데 후기들 보니까 단기간에 점수 오른 사례가 꽤 있더라구요. 기대됩니다.',
  },
  {
    title: '국제대회 성과 공유 게시물',
    factors: [{ label: '국가대표', detail: '대표 배출 성과' }],
    summary: ['브랜드 평판에 긍정적 영향을 주는 성과 홍보'],
    raw: '축하합니다! 이번 국제대회에 국가대표로 선발된 학생이 나왔네요. 역시 커리큘럼이 탄탄하니까 이런 결과가 나오는 것 같습니다.',
  },
];

const NEGATIVE_TEMPLATES: IssueTemplate[] = [
  {
    title: '설정 과정이 다소 복잡하다는 의견',
    factors: [{ label: '혼란', detail: '초기 설정 과정에서의 혼란' }],
    summary: ['온보딩 과정에서 이탈 가능성 확인', '가이드 보완 필요성 제기'],
    raw: '처음 등록할 때 절차가 좀 헷갈리더라구요. 어디서부터 시작해야 할지 안내가 조금 더 자세했으면 좋겠어요. 결국은 전화로 물어봐서 해결했습니다.',
  },
  {
    title: '비용 부담에 대한 의견 게시',
    factors: [{ label: '비용', detail: '경제적 비용 부담' }],
    summary: ['타 학원 대비 상대적 비용 부담 언급'],
    raw: '수업 자체는 괜찮은데 옆 동네 다른 학원이랑 비교하면 확실히 수강료가 부담스러운 편이에요. 형제 할인이라도 좀 더 있으면 좋겠습니다.',
  },
];

let issueCounter = 0;
function makeIssue(
  keywordId: string,
  date: string,
  sentiment: 'positive' | 'negative',
  template: IssueTemplate,
  sourceIdx: number,
  isAd = false,
): IssueItem {
  issueCounter += 1;
  const source = SOURCES[sourceIdx % SOURCES.length];
  const impactPool: Array<'매우 좋음' | '좋음' | '다소 좋음' | '나쁨' | '다소 나쁨'> =
    sentiment === 'positive' ? ['매우 좋음', '좋음', '다소 좋음'] : ['나쁨', '다소 나쁨'];
  return {
    id: `issue-${keywordId}-${issueCounter}`,
    keywordId,
    source: SOURCE_LABEL[source],
    date,
    time: `${String(9 + (issueCounter % 10)).padStart(2, '0')}:${String((issueCounter * 7) % 60).padStart(2, '0')}`,
    title: template.title,
    url: '#',
    rawText: template.raw,
    sentiment,
    confidence: sentiment === 'positive' ? 80 + (issueCounter % 18) : 55 + (issueCounter % 20),
    summaryBullets: template.summary,
    category: sentiment === 'positive' ? '서비스' : '기타 의견',
    tags: sentiment === 'positive' ? ['품질'] : ['비용', '운영'],
    inflowChannel: SOURCE_LABEL[source],
    isAd,
    impactLevels: template.factors.map((_, i) => impactPool[i % impactPool.length]),
    factors: template.factors,
  };
}

function buildIssuesFor(keywordId: string, count: number, negativeRatio = 0.12): IssueItem[] {
  const rnd = seededRandom(keywordId.length * 53 + count);
  const items: IssueItem[] = [];
  const baseDate = new Date('2026-08-16T00:00:00');
  for (let i = 0; i < count; i += 1) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - Math.round(i * (1 + rnd() * 3)));
    const dateStr = d.toISOString().slice(0, 10).replace(/-/g, '.');
    const negative = rnd() < negativeRatio;
    const pool = negative ? NEGATIVE_TEMPLATES : POSITIVE_TEMPLATES;
    const template = pool[i % pool.length];
    items.push(makeIssue(keywordId, dateStr, negative ? 'negative' : 'positive', template, i, rnd() < 0.15));
  }
  return items;
}

export const ISSUES_BY_KEYWORD: Record<string, IssueItem[]> = {};
ALL_KEYWORDS.forEach((k) => {
  const isFeatured = k.id === 'junggye-cms';
  ISSUES_BY_KEYWORD[k.id] = buildIssuesFor(k.id, isFeatured ? 9 : 3);
});

export const ALL_ISSUES: IssueItem[] = Object.values(ISSUES_BY_KEYWORD)
  .flat()
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export const INSIGHTS_BY_KEYWORD: Record<string, InsightData> = {
  'junggye-cms': {
    keywordId: 'junggye-cms',
    date: '2026-08-16',
    analyzedChannel: '네이버 카페 (1건)',
    analyzedCount: 1,
    avgRelevance: 95.0,
    positiveKeywords: ['만족', '체계', '심화'],
    negativeKeywords: [],
    positiveFactors: [
      { title: '만족', percent: 95, description: '오답 학습 시스템에 대한 만족', effect: '학습 성과에 대한 신뢰도 향상' },
      { title: '체계', percent: 95, description: '분기별 커리큘럼 구성이 체계적임', effect: '학습 방향성과 계획 수립 용이' },
      { title: '심화', percent: 95, description: '최상위 교재로 심도있게 학습', effect: '고난도 문제 해결 능력 배양' },
    ],
    negativeFactors: [],
    checkpoints: [
      '분기 커리큘럼의 체계성에 대한 높은 만족감 확인',
      '최상위 교재 중심의 심화 학습으로 빠른 진도 적용',
      '오답 학습 시스템의 효과성에 대한 긍정적 평가',
    ],
    conclusionSummary:
      '중계 CMS 학원에 대한 긍정적 후기로, 체계적인 커리큘럼과 심화 학습, 오답 학습 시스템에 대한 만족이 높게 나타났습니다.',
    conclusionNegative: '특별한 부정적 요소는 발견되지 않음',
    conclusionPositive: '분기별 커리큘럼의 체계성, 최상위 교재 기반 심화 학습, 오답 학습 시스템의 효과',
    conclusionClosing:
      '해당 학원은 학습 체계와 교재 수준에 대한 신뢰를 바탕으로 학부모의 높은 만족을 이끌어내고 있으며, 향후에도 긍정적인 평가가 지속될 가능성이 높습니다.',
    sources: [{ date: '8월 16일', title: 'CMS 중계교과관 FIT 초등수강후기 (네이버 카페)' }],
  },
};

export function insightFor(keywordId: string): InsightData {
  return (
    INSIGHTS_BY_KEYWORD[keywordId] ?? {
      keywordId,
      date: '2026-08-16',
      analyzedChannel: '데이터 없음',
      analyzedCount: 0,
      avgRelevance: 0,
      positiveKeywords: [],
      negativeKeywords: [],
      positiveFactors: [],
      negativeFactors: [],
      checkpoints: [],
      conclusionSummary: '아직 분석할 데이터가 충분하지 않습니다.',
      conclusionNegative: '데이터 없음',
      conclusionPositive: '데이터 없음',
      conclusionClosing: '데이터가 쌓이면 리포트가 자동으로 갱신됩니다.',
      sources: [],
    }
  );
}
