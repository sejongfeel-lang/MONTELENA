import { useState } from 'react';
import { ALL_KEYWORDS, ISSUES_BY_KEYWORD, findKeyword } from '../data/mockData';
import type { FolderNode } from '../types';

function statsFor(keywordId: string) {
  const issues = ISSUES_BY_KEYWORD[keywordId] ?? [];
  const positive = issues.filter((i) => i.sentiment === 'positive').length;
  const negative = issues.filter((i) => i.sentiment === 'negative').length;
  const total = issues.length;
  return { total, positive, negative, positiveRate: total ? Math.round((positive / total) * 100) : 0 };
}

export function CompetitorModal({
  folders,
  baseKeywordId,
  onClose,
}: {
  folders: FolderNode[];
  baseKeywordId: string;
  onClose: () => void;
}) {
  const otherKeywords = ALL_KEYWORDS.filter((k) => k.id !== baseKeywordId);
  const [competitorId, setCompetitorId] = useState(otherKeywords[0]?.id ?? '');

  const base = findKeyword(baseKeywordId);
  const competitor = findKeyword(competitorId);
  const baseStats = statsFor(baseKeywordId);
  const compStats = statsFor(competitorId);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ width: 480 }} onClick={(e) => e.stopPropagation()}>
        <h3>✎ 경쟁사 분석</h3>
        <p className="modal-hint">비교할 키워드를 선택하면 이슈 지표를 나란히 비교합니다.</p>

        <label className="field-label">비교 대상 키워드</label>
        <select className="field-select" value={competitorId} onChange={(e) => setCompetitorId(e.target.value)}>
          {folders.map((f) => (
            <optgroup key={f.id} label={f.name}>
              {f.keywords
                .filter((k) => k.id !== baseKeywordId)
                .map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.name}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>

        <table className="metric-table" style={{ marginTop: 8 }}>
          <thead>
            <tr>
              <th>지표</th>
              <th>{base?.name ?? '-'}</th>
              <th>{competitor?.name ?? '-'}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>전체 이슈</td>
              <td>{baseStats.total}건</td>
              <td>{compStats.total}건</td>
            </tr>
            <tr>
              <td>긍정 비율</td>
              <td style={{ color: 'var(--green)', fontWeight: 700 }}>{baseStats.positiveRate}%</td>
              <td style={{ color: 'var(--green)', fontWeight: 700 }}>{compStats.positiveRate}%</td>
            </tr>
            <tr>
              <td>부정 이슈</td>
              <td style={{ color: 'var(--red)', fontWeight: 700 }}>{baseStats.negative}건</td>
              <td style={{ color: 'var(--red)', fontWeight: 700 }}>{compStats.negative}건</td>
            </tr>
          </tbody>
        </table>

        <p className="field-hint" style={{ marginTop: 14 }}>
          {baseStats.positiveRate >= compStats.positiveRate
            ? `${base?.name}이(가) ${competitor?.name} 대비 긍정 비율이 높습니다.`
            : `${competitor?.name}이(가) ${base?.name} 대비 긍정 비율이 높습니다.`}
        </p>

        <div className="modal-actions">
          <button className="btn btn-primary" style={{ flex: 'none', margin: '0 auto', padding: '10px 24px' }} onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
