import { useEffect, useMemo, useState } from 'react';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { CHANNELS, findKeyword, trendFor } from '../data/mockData';
import { useIssuesFor, useIsBackendKeyword, setLiveIssues } from '../data/liveStore';
import { crawlKeyword, fetchIssues } from '../api/client';

// 실제 수집(크롤링)은 백엔드 스케줄러가 15분마다 서버에서 담당합니다(프론트 탭을 닫아도 계속 동작).
// 프론트는 화면을 보고 있는 동안 그 결과를 자주 읽어와 최신 상태로만 반영합니다.
const DISPLAY_SYNC_MS = 30_000;
import { IssueCard } from './IssueCard';
import { KeywordDefinitionModal } from './KeywordDefinitionModal';
import { FilterModal, DEFAULT_FILTER_SETTINGS, type FilterSettings } from './FilterModal';

interface KeywordColumnProps {
  keywordId: string;
  onEditKeyword: (keywordId: string) => void;
  onDeleteKeyword: (keywordId: string) => void;
}

function KeywordColumn({ keywordId, onEditKeyword, onDeleteKeyword }: KeywordColumnProps) {
  const keyword = findKeyword(keywordId);
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(CHANNELS.map((c) => [c.id, keyword?.channels.includes(c.id) ?? true])),
  );
  const trend = useMemo(() => trendFor(keywordId), [keywordId]);
  const allIssues = useIssuesFor(keywordId);

  const [crawling, setCrawling] = useState(false);
  const [crawlMsg, setCrawlMsg] = useState<string | null>(null);
  const [showDefinition, setShowDefinition] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filterSettings, setFilterSettings] = useState<FilterSettings>(DEFAULT_FILTER_SETTINGS);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date | null>(null);
  const isLive = useIsBackendKeyword(keywordId);

  const issues = useMemo(
    () =>
      allIssues.filter(
        (i) => (filterSettings.includeAds || !i.isAd) && i.confidence >= filterSettings.relevanceThreshold,
      ),
    [allIssues, filterSettings],
  );
  const today = issues.filter((i) => i.date === '2026.08.16');
  const positiveToday = today.filter((i) => i.sentiment === 'positive').length;
  const negativeToday = today.filter((i) => i.sentiment === 'negative').length;

  async function handleCrawlNow() {
    setCrawling(true);
    setCrawlMsg(null);
    try {
      const result = await crawlKeyword(keywordId);
      setLiveIssues(keywordId, result.issues);
      setLastRefreshedAt(new Date());
      setCrawlMsg(
        result.added > 0 ? `✓ 새 이슈 ${result.added}건 수집 완료` : '✓ 수집 완료 (새로운 이슈 없음)',
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : '수집 중 오류가 발생했습니다.';
      setCrawlMsg(
        message.includes('찾을 수 없습니다')
          ? '이 키워드는 데모용 목업 데이터입니다. "+ 키워드 등록"으로 새 키워드를 추가하면 실제 네이버 검색 결과를 수집할 수 있어요.'
          : message,
      );
    } finally {
      setCrawling(false);
    }
  }

  // 실제 수집은 백엔드 스케줄러가 담당합니다. 여기서는 화면을 보고 있는 동안
  // 그 결과를 주기적으로 읽어와 최신 상태로 동기화만 합니다(중복 수집 방지).
  useEffect(() => {
    if (!isLive) return;
    const sync = () => {
      fetchIssues(keywordId)
        .then((issues) => {
          setLiveIssues(keywordId, issues);
          setLastRefreshedAt(new Date());
        })
        .catch(() => {});
    };
    const interval = setInterval(sync, DISPLAY_SYNC_MS);
    return () => clearInterval(interval);
  }, [isLive, keywordId]);

  if (!keyword) return null;

  return (
    <div className="panel">
      <div className="panel-header-row">
        {isLive ? (
          <span className="refresh-note">
            🔄 마지막 갱신:{' '}
            {lastRefreshedAt
              ? lastRefreshedAt.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
              : '아직 없음'}{' '}
            (서버가 15분마다 자동 수집 · 화면은 30초마다 동기화)
          </span>
        ) : (
          <span className="refresh-note" title="데모용 목업 데이터라 자동 갱신되지 않습니다.">
            ⏸ 데모 데이터 · 자동 갱신 없음
          </span>
        )}
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="pill-btn live" onClick={() => handleCrawlNow()} disabled={crawling}>
            {crawling ? '수집 중…' : '지금 수집 ▶'}
          </button>
          <button className="pill-btn" onClick={() => setShowFilter(true)}>
            필터 ⚙
          </button>
        </div>
      </div>
      {crawlMsg && (
        <div className="field-hint" style={{ margin: '-8px 0 12px' }}>
          {crawlMsg}
        </div>
      )}
      {showFilter && (
        <FilterModal
          value={filterSettings}
          onClose={() => setShowFilter(false)}
          onConfirm={(next) => {
            setFilterSettings(next);
            setShowFilter(false);
          }}
        />
      )}

      <div className="channel-grid">
        {CHANNELS.map((c) => (
          <label className="channel-chip" key={c.id}>
            <input
              type="checkbox"
              checked={enabled[c.id]}
              onChange={() => setEnabled((prev) => ({ ...prev, [c.id]: !prev[c.id] }))}
            />
            {c.label}
          </label>
        ))}
      </div>

      <div className="keyword-card">
        <div className="keyword-card-head">
          <h3>{keyword.name}</h3>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn btn-ghost" onClick={() => setShowDefinition(true)}>
              키워드 정의
            </button>
            <button className="btn btn-ghost" onClick={() => onEditKeyword(keywordId)}>
              ✎ 수정
            </button>
            <button className="btn btn-ghost" onClick={() => onDeleteKeyword(keywordId)}>
              🗑 삭제
            </button>
          </div>
        </div>
        {showDefinition && (
          <KeywordDefinitionModal
            keyword={keyword}
            onClose={() => setShowDefinition(false)}
            onEdit={() => {
              setShowDefinition(false);
              onEditKeyword(keywordId);
            }}
          />
        )}
        <div className="stat-row">
          <div className="stat-tile">
            <div className="icon">🔔</div>
            <div className="num">{today.length}건</div>
            <div className="label">전체 이슈</div>
          </div>
          <div className="stat-tile">
            <div className="icon">👍</div>
            <div className="num" style={{ color: 'var(--green)' }}>
              {positiveToday}건
            </div>
            <div className="label">긍정적 요소</div>
          </div>
          <div className="stat-tile negative">
            <div className="icon">👎</div>
            <div className="num">{negativeToday}건</div>
            <div className="label">부정적 요소</div>
          </div>
        </div>
        <div className="chart-note">24시간 기준으로 발생한 데이터입니다.</div>
      </div>

      <div className="section-label">실시간 긍정부정 변화량</div>
      <div className="chart-note">시간순으로 긍정과 부정에 대한 의견 숫자를 보여줍니다</div>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={trend} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eef0f6" />
          <XAxis dataKey="time" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="positive" stroke="#3b82f6" strokeWidth={2} dot={false} name="긍정" />
          <Line type="monotone" dataKey="negative" stroke="#e0334d" strokeWidth={2} dot={false} name="부정" />
        </LineChart>
      </ResponsiveContainer>

      <div className="section-label" style={{ marginTop: 20 }}>
        이슈 피드
        {(!filterSettings.includeAds || filterSettings.relevanceThreshold > DEFAULT_FILTER_SETTINGS.relevanceThreshold) && (
          <span className="pill-btn" style={{ marginLeft: 8, fontSize: 11 }}>
            필터 적용 중 {!filterSettings.includeAds ? '· 광고성 제외' : ''}
            {filterSettings.relevanceThreshold > DEFAULT_FILTER_SETTINGS.relevanceThreshold
              ? ` · 관련성 ${filterSettings.relevanceThreshold}%+`
              : ''}
          </span>
        )}
      </div>
      <div className="issue-feed">
        {issues.length === 0 ? (
          <div className="empty-state">
            {allIssues.length === 0 ? '아직 감지된 이슈가 없습니다.' : '설정한 필터 조건에 맞는 이슈가 없습니다.'}
          </div>
        ) : (
          issues.map((issue) => <IssueCard key={issue.id} issue={issue} />)
        )}
      </div>
    </div>
  );
}

interface RealtimeTabProps {
  keywordId: string;
  pairedId: string;
  onCompetitorAnalysis: () => void;
  onEditKeyword: (keywordId: string) => void;
  onDeleteKeyword: (keywordId: string) => void;
}

export function RealtimeTab({
  keywordId,
  pairedId,
  onCompetitorAnalysis,
  onEditKeyword,
  onDeleteKeyword,
}: RealtimeTabProps) {
  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">
            <span className="ai-dot" /> AI 실시간 감지
          </h1>
          <p className="page-sub">브랜드와 서비스, 개인과 기업을 실시간으로 AI가 보호해 드립니다.</p>
        </div>
        <button className="btn btn-primary" onClick={onCompetitorAnalysis}>
          ✎ 경쟁사 분석
        </button>
      </div>

      <div className="columns-2">
        <KeywordColumn keywordId={keywordId} onEditKeyword={onEditKeyword} onDeleteKeyword={onDeleteKeyword} />
        <KeywordColumn keywordId={pairedId} onEditKeyword={onEditKeyword} onDeleteKeyword={onDeleteKeyword} />
      </div>
    </>
  );
}
