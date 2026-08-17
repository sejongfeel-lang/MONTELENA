import type { IssueItem } from '../types';

export function IssueCard({ issue }: { issue: IssueItem }) {
  const hasRealLink = Boolean(issue.url) && issue.url !== '#';
  return (
    <div className="issue-card">
      <div className="issue-card-top">
        <div>
          <div className="issue-source-line">
            {issue.source} · {issue.date} {issue.time}
            {issue.isAd ? ' · 광고성' : ''}
          </div>
          <p className="issue-title">{issue.title}</p>
        </div>
        <span className={`sentiment-badge ${issue.sentiment}`}>
          {issue.sentiment === 'positive' ? `긍정 ${issue.confidence}%` : `부정 ${issue.confidence}%`}
        </span>
      </div>

      <div className="ai-summary-box">
        <div className="label">AI 분석 요약</div>
        <ul>
          {issue.summaryBullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </div>

      <div className="issue-card-footer">
        {hasRealLink ? (
          <a className="original-link" href={issue.url} target="_blank" rel="noopener noreferrer">
            원문 보기 →
          </a>
        ) : (
          <span className="original-link disabled" title="목업 데이터에는 원문 링크가 없습니다">
            원문 보기 (목업 데이터)
          </span>
        )}
        <span className="confidence-tag">신뢰도 {issue.confidence}%</span>
      </div>
    </div>
  );
}
