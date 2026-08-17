import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { findKeyword } from '../data/mockData';
import { useIssuesFor } from '../data/liveStore';
import { IssueCard } from './IssueCard';
import type { IssueItem } from '../types';

const BAR_COLORS = ['#6d5ef8', '#e0334d', '#3b82f6', '#f59e0b', '#16a34a', '#a855f7'];

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function useReportData(keywordId: string, issues: IssueItem[]) {
  return useMemo(() => {
    const rnd = seeded(keywordId.length * 71 + 3);
    const barData = ['월', '화', '수', '목', '금', '토'].map((d) => ({
      day: d,
      value: Math.round(rnd() * 8) + 1,
    }));
    const lineData = Array.from({ length: 14 }, (_, i) => ({
      t: i,
      v: Math.round(rnd() * 6) + 2,
    }));
    const positive = issues.filter((i) => i.sentiment === 'positive').length;
    const negative = issues.filter((i) => i.sentiment === 'negative').length;
    const pieData = [
      { name: '긍정', value: positive || 1 },
      { name: '부정', value: negative },
    ];
    const tags = Array.from(new Set(issues.flatMap((i) => i.factors.map((f) => f.label)))).slice(0, 8);
    return { barData, lineData, pieData, tags, positive, negative, total: issues.length };
  }, [keywordId, issues]);
}

function ReportColumn({ keywordId }: { keywordId: string }) {
  const keyword = findKeyword(keywordId);
  const issues = useIssuesFor(keywordId);
  const { barData, lineData, pieData, tags, positive, negative, total } = useReportData(keywordId, issues);
  if (!keyword) return null;

  const positiveRate = total ? Math.round((positive / total) * 100) : 0;

  return (
    <div className="panel">
      <div className="keyword-card-head">
        <h3>{keyword.name}</h3>
        <button className="btn btn-outline">⬇ 리포트 다운로드</button>
      </div>

      <div className="report-stat-row">
        <div className="stat-tile">
          <div className="num">{total}건</div>
          <div className="label">전체 이슈</div>
        </div>
        <div className="stat-tile">
          <div className="num" style={{ color: 'var(--green)' }}>
            {positiveRate}%
          </div>
          <div className="label">긍정 비율</div>
        </div>
        <div className="stat-tile negative">
          <div className="num">{negative}건</div>
          <div className="label">부정 요소</div>
        </div>
      </div>

      <div className="chart-block">
        <div className="section-label">브랜드 선호 순위</div>
        <div className="report-mini-chart">데이터 누적 중 · 최초 리포트는 등록 24시간 후 제공됩니다</div>
      </div>

      <div className="chart-block">
        <div className="section-label">키워드별 변화 추이</div>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={barData} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eef0f6" />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {barData.map((_, i) => (
                <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-block">
        <div className="section-label">감성 분석 비중</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <ResponsiveContainer width={120} height={120}>
            <PieChart>
              <Pie data={pieData} dataKey="value" innerRadius={32} outerRadius={54} paddingAngle={2}>
                <Cell fill="#3b82f6" />
                <Cell fill="#e0334d" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ fontSize: 12.5 }}>
            <div style={{ color: 'var(--blue)', fontWeight: 700 }}>● 긍정 {positive}건</div>
            <div style={{ color: 'var(--red)', fontWeight: 700, marginTop: 6 }}>● 부정 {negative}건</div>
          </div>
        </div>
      </div>

      <div className="chart-block">
        <div className="section-label">관련 키워드 클라우드</div>
        <div className="tag-cloud">
          {tags.length === 0 ? (
            <span className="empty-state">데이터 없음</span>
          ) : (
            tags.map((t, i) => (
              <span
                key={t}
                className="tag-bubble"
                style={{
                  width: 56 + (i % 3) * 14,
                  height: 56 + (i % 3) * 14,
                  fontSize: 12 + (i % 3) * 2,
                }}
              >
                {t}
              </span>
            ))
          )}
        </div>
      </div>

      <div className="chart-block">
        <div className="section-label">내부 채널 모니터링</div>
        <ResponsiveContainer width="100%" height={110}>
          <LineChart data={lineData} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
            <XAxis dataKey="t" hide />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="v" stroke="#16a34a" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="section-label">이슈 피드</div>
      <div className="issue-feed">
        {issues.slice(0, 4).map((issue) => (
          <IssueCard key={issue.id} issue={issue} />
        ))}
      </div>
    </div>
  );
}

export function ReportTab({ keywordId, pairedId }: { keywordId: string; pairedId: string }) {
  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">
            <span className="ai-dot" /> AI 종합 리포트
          </h1>
          <p className="page-sub">기간에 따른 이슈와 지표를 AI가 종합해서 보여드립니다.</p>
        </div>
      </div>

      <div className="columns-2">
        <ReportColumn keywordId={keywordId} />
        <ReportColumn keywordId={pairedId} />
      </div>
    </>
  );
}
