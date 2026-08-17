const ENDPOINTS = {
  news: { url: 'https://openapi.naver.com/v1/search/news.json', label: '네이버 뉴스' },
  blog: { url: 'https://openapi.naver.com/v1/search/blog.json', label: '네이버 블로그' },
  cafearticle: { url: 'https://openapi.naver.com/v1/search/cafearticle.json', label: '네이버 카페' },
};

function stripHtml(text) {
  return text.replace(/<[^>]*>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&').trim();
}

function toDateString(raw) {
  if (!raw) return new Date().toISOString().slice(0, 10).replace(/-/g, '.');
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  return d.toISOString().slice(0, 10).replace(/-/g, '.');
}

export function naverConfigured() {
  return Boolean(process.env.NAVER_CLIENT_ID && process.env.NAVER_CLIENT_SECRET);
}

async function searchOne(kind, query, display) {
  const { url, label } = ENDPOINTS[kind];
  const res = await fetch(`${url}?query=${encodeURIComponent(query)}&display=${display}&sort=date`, {
    headers: {
      'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
      'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET,
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Naver ${kind} search failed (${res.status}): ${body.slice(0, 200)}`);
  }
  const json = await res.json();
  return (json.items ?? []).map((item) => ({
    source: label,
    sourceKind: kind,
    title: stripHtml(item.title ?? ''),
    description: stripHtml(item.description ?? ''),
    url: item.link ?? item.originallink ?? '#',
    date: toDateString(item.postdate ?? item.pubDate ?? item.cafename),
  }));
}

export async function searchKeyword(query, { display = 8 } = {}) {
  if (!naverConfigured()) {
    throw new Error('NAVER_CLIENT_ID / NAVER_CLIENT_SECRET가 설정되지 않았습니다.');
  }
  const kinds = Object.keys(ENDPOINTS);
  const results = await Promise.allSettled(kinds.map((k) => searchOne(k, query, display)));
  const items = [];
  const errors = [];
  results.forEach((r, i) => {
    if (r.status === 'fulfilled') items.push(...r.value);
    else errors.push(`${kinds[i]}: ${r.reason.message}`);
  });
  return { items, errors };
}
