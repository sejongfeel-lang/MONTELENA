import { findKeyword, insightFor } from '../data/mockData';

function formatKoreanDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${y}년 ${m}월 ${d}일`;
}

function InsightColumn({ keywordId }: { keywordId: string }) {
  const keyword = findKeyword(keywordId);
  const data = insightFor(keywordId);
  if (!keyword) return null;

  return (
    <div className="panel">
      <div className="insight-header">
        <h3>{keyword.name}</h3>
        <span className="date-badge">📅 {data.date}</span>
      </div>

      <div className="section-label">🔍 분석 개요</div>
      <ol className="overview-list">
        <li>기간: {formatKoreanDate(data.date)}</li>
        <li>분석 매체: {data.analyzedChannel}</li>
        <li>분석 건수: {data.analyzedCount}</li>
        <li>평균 관련성: {data.avgRelevance.toFixed(2)}%</li>
      </ol>

      <div className="section-label">📊 핵심 지표 요약</div>
      <table className="metric-table">
        <thead>
          <tr>
            <th>구분</th>
            <th>건수</th>
            <th>비중</th>
            <th>주요 키워드</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>긍정적 요소</td>
            <td>{data.positiveFactors.length}건</td>
            <td>{data.positiveFactors.length ? '100%' : '0%'}</td>
            <td>{data.positiveKeywords.join(', ') || '-'}</td>
          </tr>
          <tr>
            <td>부정적 요소</td>
            <td>{data.negativeFactors.length}건</td>
            <td>{data.negativeFactors.length ? '100%' : '0%'}</td>
            <td>{data.negativeKeywords.join(', ') || '-'}</td>
          </tr>
        </tbody>
      </table>

      <div className="section-label" style={{ color: 'var(--green)' }}>
        ✅ 긍정적 주요 요소 ({data.positiveFactors.length}건)
      </div>
      {data.positiveFactors.length === 0 ? (
        <div className="empty-state">해당 없음</div>
      ) : (
        <ol className="factor-list">
          {data.positiveFactors.map((f) => (
            <li key={f.title}>
              {f.title} <span className="factor-percent">({f.percent}%)</span>
              <br />
              <span className="factor-sub">
                {f.description} → {f.effect}
              </span>
            </li>
          ))}
        </ol>
      )}

      {data.checkpoints.length > 0 && (
        <ul className="checkpoint-list">
          {data.checkpoints.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      )}

      <div className="section-label" style={{ color: 'var(--red)' }}>
        🚩 부정적 주요 요소 ({data.negativeFactors.length}건)
      </div>
      {data.negativeFactors.length === 0 ? (
        <div className="empty-state">해당 없음</div>
      ) : (
        <ol className="factor-list">
          {data.negativeFactors.map((f) => (
            <li key={f.title}>
              {f.title} <span className="factor-percent">({f.percent}%)</span>
              <br />
              <span className="factor-sub">
                {f.description} → {f.effect}
              </span>
            </li>
          ))}
        </ol>
      )}

      <div className="section-label">📝 결론</div>
      <div className="conclusion-box">
        <p>{data.conclusionSummary}</p>
        <p>
          <span className="k">부정요소:</span> {data.conclusionNegative}
        </p>
        <p>
          <span className="k">긍정요소:</span> {data.conclusionPositive}
        </p>
        <p>{data.conclusionClosing}</p>
      </div>

      <div className="section-label">🗂 분석 출처 ({data.sources.length})</div>
      {data.sources.length === 0 ? (
        <div className="empty-state">출처 없음</div>
      ) : (
        <ul className="source-list">
          {data.sources.map((s) => (
            <li key={s.title}>
              {s.date}, {s.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

interface InsightTabProps {
  keywordId: string;
  pairedId: string;
  onCompetitorAnalysis: () => void;
}

export function InsightTab({ keywordId, pairedId, onCompetitorAnalysis }: InsightTabProps) {
  return (
    <>
      <div className="page-head insight-print-header">
        <div>
          <h1 className="page-title">
            <span className="ai-dot" /> AI 인사이트
          </h1>
          <p className="page-sub">기간에 따른 이슈를 AI가 정리해서 보여드립니다.</p>
        </div>
        <div className="no-print" style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-outline" onClick={() => window.print()}>
            ⬇ PDF 다운로드
          </button>
          <button className="btn btn-primary" onClick={onCompetitorAnalysis}>
            ✎ 경쟁사 분석
          </button>
        </div>
      </div>

      <div className="columns-2">
        <InsightColumn keywordId={keywordId} />
        <InsightColumn keywordId={pairedId} />
      </div>
    </>
  );
}
