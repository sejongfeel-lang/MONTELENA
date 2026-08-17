import { useState } from 'react';
import { findKeyword } from '../data/mockData';
import { useAllIssues, useIssuesFor } from '../data/liveStore';
import type { ImpactLevel, IssueItem } from '../types';

const PAGE_SIZE = 15;

function impactClass(level: ImpactLevel) {
  return level === '나쁨' || level === '다소 나쁨' || level === '매우 나쁨' ? 'impact-badge bad' : 'impact-badge';
}

function downloadCsv(rows: IssueItem[]) {
  const header = ['날짜', '원문 제목', '긍정/부정', '이슈', '카테고리', '태그', '유입채널', '광고'];
  const lines = rows.map((r) =>
    [
      r.date,
      r.title,
      r.sentiment === 'positive' ? '긍정' : '부정',
      r.factors.map((f) => `${f.label}: ${f.detail}`).join(' / '),
      r.category,
      r.tags.join(','),
      r.inflowChannel,
      r.isAd ? '광고성' : '비광고성',
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(','),
  );
  const csv = [header.join(','), ...lines].join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'binder-issue-list.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export function IssueListTab({ keywordId }: { keywordId: string }) {
  const keyword = findKeyword(keywordId);
  const [page, setPage] = useState(1);
  const [scope, setScope] = useState<'keyword' | 'all'>('keyword');

  const keywordIssues = useIssuesFor(keywordId);
  const allIssues = useAllIssues();
  const rows = scope === 'keyword' ? keywordIssues : allIssues;

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const pageRows = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">이슈 리스트</h1>
          <p className="page-sub">현재까지 발생된 주요 이슈를 표로 확인할 수 있습니다.</p>
        </div>
      </div>

      <div className="filter-row">
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className={`btn ${scope === 'keyword' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => {
              setScope('keyword');
              setPage(1);
            }}
          >
            {keyword?.name ?? '선택 키워드'}
          </button>
          <button
            className={`btn ${scope === 'all' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => {
              setScope('all');
              setPage(1);
            }}
          >
            전체 키워드
          </button>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span className="date-range-input">📅 2026.06.01 → 2026.08.16</span>
          <button className="btn btn-primary" onClick={() => downloadCsv(rows)}>
            ⬇ 엑셀 다운로드
          </button>
        </div>
      </div>

      <div className="pagination-info">
        {rows.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, rows.length)} / 총{' '}
        {rows.length}건
      </div>

      <div className="issue-table-wrap">
        <table className="issue-table">
          <thead>
            <tr>
              <th>날짜</th>
              <th>원문 제목</th>
              <th>긍정/부정</th>
              <th>영향등급</th>
              <th>이슈</th>
              <th>카테고리</th>
              <th>태그</th>
              <th>유입채널</th>
              <th>광고</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={9}>
                  <div className="empty-state">표시할 이슈가 없습니다.</div>
                </td>
              </tr>
            ) : (
              pageRows.map((issue) => {
                const hasRealLink = Boolean(issue.url) && issue.url !== '#';
                return (
                <tr key={issue.id}>
                  <td>{issue.date}</td>
                  <td>
                    {hasRealLink ? (
                      <a
                        className="original-link"
                        href={issue.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: 'block', marginBottom: 2, fontWeight: 700 }}
                      >
                        {issue.title}
                      </a>
                    ) : (
                      <span
                        className="original-link disabled"
                        title="목업 데이터에는 원문 링크가 없습니다"
                        style={{ display: 'block', marginBottom: 2, fontWeight: 700 }}
                      >
                        {issue.title}
                      </span>
                    )}
                    <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>{issue.source}</span>
                  </td>
                  <td>
                    <span className={`sentiment-badge ${issue.sentiment}`}>
                      {issue.sentiment === 'positive' ? '긍정' : '부정'}
                    </span>
                  </td>
                  <td>
                    {issue.impactLevels.map((lvl, i) => (
                      <span key={i} className={impactClass(lvl)}>
                        {lvl}
                      </span>
                    ))}
                  </td>
                  <td style={{ minWidth: 220 }}>
                    {issue.factors.map((f) => (
                      <div key={f.label}>
                        {f.label}: {f.detail}
                      </div>
                    ))}
                  </td>
                  <td>{issue.category}</td>
                  <td>{issue.tags.join(', ')}</td>
                  <td>{issue.inflowChannel}</td>
                  <td>{issue.isAd ? '광고성' : '비광고성'}</td>
                </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
          ‹
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
          <button key={n} className={n === page ? 'active' : ''} onClick={() => setPage(n)}>
            {n}
          </button>
        ))}
        <button disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
          ›
        </button>
      </div>
    </>
  );
}
