import { findKeyword } from '../data/mockData';
import { useIssuesFor } from '../data/liveStore';

function InboxColumn({ keywordId }: { keywordId: string }) {
  const keyword = findKeyword(keywordId);
  const issues = useIssuesFor(keywordId);
  if (!keyword) return null;

  return (
    <div className="panel">
      <div className="keyword-card-head">
        <h3>{keyword.name}</h3>
        <span className="pill-btn">오리지널 데이터</span>
      </div>

      <div className="issue-feed">
        {issues.length === 0 ? (
          <div className="empty-state">아직 수집된 원본 데이터가 없습니다.</div>
        ) : (
          issues.map((issue) => {
            const hasRealLink = Boolean(issue.url) && issue.url !== '#';
            return (
              <div className="issue-card inbox-card" key={issue.id}>
                <div className="issue-source-line">
                  {issue.source} · {issue.date} {issue.time}
                  {issue.isAd ? ' · 광고성' : ''}
                </div>
                {hasRealLink ? (
                  <a
                    className="issue-title inbox-title"
                    href={issue.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {issue.title}
                  </a>
                ) : (
                  <p className="issue-title inbox-title">{issue.title}</p>
                )}
                <p className="inbox-raw-text">{issue.rawText ?? issue.summaryBullets.join(' ')}</p>
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
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export function InboxTab({ keywordId, pairedId }: { keywordId: string; pairedId: string }) {
  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">📥 Inbox</h1>
          <p className="page-sub">
            AI가 가공하기 전, 수집된 그대로의 오리지널 데이터입니다. AI 실시간감지·인사이트·종합리포트는 이 데이터를
            AI가 정제한 결과예요.
          </p>
        </div>
      </div>

      <div className="columns-2">
        <InboxColumn keywordId={keywordId} />
        <InboxColumn keywordId={pairedId} />
      </div>
    </>
  );
}
