const POSITIVE_WORDS = [
  '만족', '추천', '좋아요', '좋은', '좋다', '최고', '친절', '꼼꼼', '편리', '효율',
  '체계', '체계적', '심화', '맞춤', '쉬움', '쉬운', '믿음', '신뢰', '성과', '향상',
  '효과', '혜택', '할인', '무료', '재밌', '흥미', '기대', '감사', '든든', '알찬',
];

const NEGATIVE_WORDS = [
  '불만', '실망', '별로', '환불', '불편', '지연', '비싸', '부담', '혼란', '민원',
  '문제', '고장', '장애', '취소', '거부', '부족', '어려움', '나쁨', '나쁘', '불친절',
  '적자', '손실', '논란', '피해', '불안', '걱정',
];

function countMatches(text, words) {
  const found = [];
  for (const w of words) {
    if (text.includes(w)) found.push(w);
  }
  return found;
}

export function lexiconAnalyze(title, description) {
  const text = `${title} ${description}`;
  const positiveHits = countMatches(text, POSITIVE_WORDS);
  const negativeHits = countMatches(text, NEGATIVE_WORDS);

  const sentiment = negativeHits.length > positiveHits.length ? 'negative' : 'positive';
  const winningHits = sentiment === 'positive' ? positiveHits : negativeHits;
  const total = positiveHits.length + negativeHits.length;
  const confidence = total === 0 ? 55 : Math.min(97, 55 + Math.round((winningHits.length / total) * 40));

  const factors = (winningHits.length ? winningHits : ['일반 언급']).slice(0, 3).map((label) => ({
    label,
    detail: `본문에서 "${label}" 관련 표현이 감지되었습니다.`,
  }));

  return {
    sentiment,
    confidence,
    summaryBullets: factors.map((f) => f.detail),
    factors,
    category: sentiment === 'positive' ? '서비스' : '기타 의견',
    tags: winningHits.slice(0, 3).length ? winningHits.slice(0, 3) : ['일반'],
  };
}

async function anthropicAnalyze(title, description) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const prompt = `다음은 브랜드 모니터링 도구가 수집한 게시물입니다. 제목과 본문을 보고 이 브랜드에 대한 감성을 분석해주세요.
제목: ${title}
본문: ${description}

아래 JSON 형식으로만 응답하세요 (설명 없이 JSON만):
{"sentiment": "positive" 또는 "negative", "confidence": 0-100 사이 정수, "factors": [{"label": "핵심 키워드(2~4글자)", "detail": "해당 요소에 대한 한 문장 설명"}] (최대 3개), "category": "서비스|품질|브랜드|마케팅|기타 의견 중 하나", "tags": ["태그1","태그2"]}`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    const text = json.content?.[0]?.text ?? '';
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    const parsed = JSON.parse(match[0]);
    return {
      sentiment: parsed.sentiment === 'negative' ? 'negative' : 'positive',
      confidence: Math.max(0, Math.min(100, Number(parsed.confidence) || 70)),
      summaryBullets: (parsed.factors ?? []).map((f) => f.detail).filter(Boolean),
      factors: parsed.factors ?? [],
      category: parsed.category ?? '기타 의견',
      tags: parsed.tags ?? [],
    };
  } catch {
    return null;
  }
}

export async function analyzeIssue(title, description) {
  const viaAnthropic = await anthropicAnalyze(title, description);
  if (viaAnthropic) return { ...viaAnthropic, engine: 'anthropic' };
  return { ...lexiconAnalyze(title, description), engine: 'lexicon' };
}
