import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { RealtimeTab } from '../components/RealtimeTab';
import { InsightTab } from '../components/InsightTab';
import { ReportTab } from '../components/ReportTab';
import { IssueListTab } from '../components/IssueListTab';
import { InboxTab } from '../components/InboxTab';
import { HelpButton } from '../components/HelpButton';
import { KeywordModal, type KeywordSubmitPayload } from '../components/KeywordModal';
import { FolderModal } from '../components/FolderModal';
import { SettingsPanel } from '../components/SettingsPanel';
import { GuideModal } from '../components/GuideModal';
import { CompetitorModal } from '../components/CompetitorModal';
import { EditKeywordModal, type KeywordEditPayload } from '../components/EditKeywordModal';
import { FOLDERS, CHANNELS, findKeyword, registerKeyword, unregisterKeyword } from '../data/mockData';
import {
  checkHealth,
  createKeyword,
  crawlKeyword,
  deleteKeyword,
  fetchIssues,
  listKeywords,
  updateKeyword,
  type HealthStatus,
} from '../api/client';
import { markBackendKeyword, setLiveIssues } from '../data/liveStore';
import type { FolderNode } from '../types';

type TabId = 'realtime' | 'insight' | 'report' | 'issues' | 'inbox';
type ViewId = 'dashboard' | 'settings';

const TABS: { id: TabId; label: string }[] = [
  { id: 'realtime', label: '실시간 감지' },
  { id: 'insight', label: '인사이트' },
  { id: 'report', label: '종합리포트' },
  { id: 'issues', label: '이슈리스트' },
  { id: 'inbox', label: 'Inbox' },
];

let newKeywordSeq = 1;
let newFolderSeq = 1;

function Dashboard() {
  const [folders, setFolders] = useState<FolderNode[]>(FOLDERS);
  const [selectedKeywordId, setSelectedKeywordId] = useState(folders[1]?.keywords[0]?.id ?? '');
  const [tab, setTab] = useState<TabId>('realtime');
  const [view, setView] = useState<ViewId>('dashboard');
  const [showKeywordModal, setShowKeywordModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showCompetitorModal, setShowCompetitorModal] = useState(false);
  const [editKeywordId, setEditKeywordId] = useState<string | null>(null);
  const [health, setHealth] = useState<HealthStatus | null>(null);

  useEffect(() => {
    checkHealth().then(setHealth);
  }, []);

  // 백엔드에 이미 등록된 키워드를 불러와 새로고침해도 사이드바에 남아있도록 병합합니다.
  useEffect(() => {
    listKeywords()
      .then(async (backendKeywords) => {
        if (backendKeywords.length === 0) return;

        setFolders((prev) => {
          const known = new Set(prev.flatMap((f) => f.keywords.map((k) => k.id)));
          const next = prev.map((f) => ({ ...f, keywords: [...f.keywords] }));
          for (const bk of backendKeywords) {
            if (known.has(bk.id)) continue;
            const node = {
              id: bk.id,
              name: bk.name,
              totalIssues: 0,
              positive: 0,
              negative: 0,
              channels: CHANNELS.map((c) => c.id),
              category: bk.category ?? '브랜드',
              synonyms: bk.synonyms ?? [],
              excludeWords: bk.excludeWords ?? [],
            };
            registerKeyword(node);
            markBackendKeyword(bk.id);
            const targetFolder = next.find((f) => f.id === bk.folderId) ?? next[0];
            targetFolder.keywords.push(node);
          }
          return next;
        });

        for (const bk of backendKeywords) {
          fetchIssues(bk.id)
            .then((issues) => setLiveIssues(bk.id, issues))
            .catch(() => {});
        }
      })
      .catch(() => {
        // 백엔드가 꺼져 있으면 목업 데이터만으로 계속 진행합니다.
      });
  }, []);

  const pairedKeywordId = (() => {
    const folder = folders.find((f) => f.keywords.some((k) => k.id === selectedKeywordId));
    if (!folder || folder.keywords.length < 2) return selectedKeywordId;
    const idx = folder.keywords.findIndex((k) => k.id === selectedKeywordId);
    return folder.keywords[(idx + 1) % folder.keywords.length].id;
  })();

  const analyzedTotal = 4000;
  const analyzedCount = 1908;

  async function handleAddKeyword({ folderId, name, category, synonyms, excludeWords }: KeywordSubmitPayload) {
    const folder = folders.find((f) => f.id === folderId);
    let id = `custom-${newKeywordSeq++}`;

    try {
      const backendKeyword = await createKeyword({
        folderId,
        folderName: folder?.name ?? folderId,
        name,
        category,
        synonyms,
        excludeWords,
      });
      id = backendKeyword.id;
      markBackendKeyword(id);
      crawlKeyword(id)
        .then((result) => setLiveIssues(id, result.issues))
        .catch(() => {
          // 네이버 API 키 미설정 등으로 초기 수집이 실패해도 키워드 등록 자체는 유지됩니다.
          // 사용자는 실시간 감지 탭의 "지금 수집" 버튼으로 다시 시도할 수 있습니다.
        });
    } catch {
      // 백엔드 서버가 꺼져 있으면 로컬 전용 키워드로 계속 진행합니다.
    }

    const node = {
      id,
      name,
      totalIssues: 0,
      positive: 0,
      negative: 0,
      channels: CHANNELS.map((c) => c.id),
      category,
      synonyms,
      excludeWords,
    };
    registerKeyword(node);
    setFolders((prev) =>
      prev.map((f) => (f.id === folderId ? { ...f, keywords: [...f.keywords, node] } : f)),
    );
    setSelectedKeywordId(id);
    setShowKeywordModal(false);
  }

  function handleAddFolder(name: string) {
    const id = `folder-${newFolderSeq++}`;
    setFolders((prev) => [...prev, { id, name, keywords: [] }]);
    setShowFolderModal(false);
  }

  async function handleEditKeyword({ name, category, synonyms, excludeWords }: KeywordEditPayload) {
    if (!editKeywordId) return;
    const id = editKeywordId;

    try {
      await updateKeyword(id, { name, category, synonyms, excludeWords });
    } catch {
      // 백엔드에 없는(목업) 키워드거나 백엔드가 꺼져 있으면 로컬 상태만 갱신합니다.
    }

    setFolders((prev) =>
      prev.map((f) => ({
        ...f,
        keywords: f.keywords.map((k) => {
          if (k.id !== id) return k;
          const updated = { ...k, name, category, synonyms, excludeWords };
          registerKeyword(updated);
          return updated;
        }),
      })),
    );
    setEditKeywordId(null);
  }

  async function handleDeleteKeyword(keywordId: string) {
    const keyword = findKeyword(keywordId);
    const ok = window.confirm(`"${keyword?.name ?? '이 키워드'}"를 삭제할까요? 수집된 이슈도 함께 삭제됩니다.`);
    if (!ok) return;

    try {
      await deleteKeyword(keywordId);
    } catch {
      // 백엔드에 없는(목업) 키워드거나 백엔드가 꺼져 있으면 로컬 상태만 갱신합니다.
    }

    unregisterKeyword(keywordId);
    setFolders((prev) => {
      const next = prev.map((f) => ({ ...f, keywords: f.keywords.filter((k) => k.id !== keywordId) }));
      if (selectedKeywordId === keywordId) {
        const fallback = next.flatMap((f) => f.keywords)[0]?.id ?? '';
        setSelectedKeywordId(fallback);
      }
      return next;
    });
  }

  return (
    <div className="app-shell">
      <Sidebar
        folders={folders}
        selectedKeywordId={selectedKeywordId}
        onSelectKeyword={(id) => {
          setSelectedKeywordId(id);
          setView('dashboard');
        }}
        onAddKeyword={() => setShowKeywordModal(true)}
        onAddFolder={() => setShowFolderModal(true)}
        onOpenSettings={() => setView('settings')}
        onOpenGuide={() => setShowGuideModal(true)}
        analyzedCount={analyzedCount}
        analyzedTotal={analyzedTotal}
        homeLink={<Link to="/">몬텔레나</Link>}
        health={health}
      />

      <main className="main">
        {view === 'settings' ? (
          <SettingsPanel channels={CHANNELS} onBack={() => setView('dashboard')} />
        ) : (
          <>
            <div className="tab-bar">
              {TABS.map((t) => (
                <button key={t.id} className={tab === t.id ? 'active' : ''} onClick={() => setTab(t.id)}>
                  {t.label}
                </button>
              ))}
            </div>

            {tab === 'realtime' && (
              <RealtimeTab
                keywordId={selectedKeywordId}
                pairedId={pairedKeywordId}
                onCompetitorAnalysis={() => setShowCompetitorModal(true)}
                onEditKeyword={setEditKeywordId}
                onDeleteKeyword={handleDeleteKeyword}
              />
            )}
            {tab === 'insight' && (
              <InsightTab
                keywordId={selectedKeywordId}
                pairedId={pairedKeywordId}
                onCompetitorAnalysis={() => setShowCompetitorModal(true)}
              />
            )}
            {tab === 'report' && <ReportTab keywordId={selectedKeywordId} pairedId={pairedKeywordId} />}
            {tab === 'issues' && <IssueListTab keywordId={selectedKeywordId} />}
            {tab === 'inbox' && <InboxTab keywordId={selectedKeywordId} pairedId={pairedKeywordId} />}
          </>
        )}
      </main>

      {showKeywordModal && (
        <KeywordModal folders={folders} onClose={() => setShowKeywordModal(false)} onSubmit={handleAddKeyword} />
      )}
      {showFolderModal && <FolderModal onClose={() => setShowFolderModal(false)} onSubmit={handleAddFolder} />}
      {showGuideModal && <GuideModal onClose={() => setShowGuideModal(false)} />}
      {editKeywordId &&
        (() => {
          const keyword = findKeyword(editKeywordId);
          return keyword ? (
            <EditKeywordModal
              keyword={keyword}
              onClose={() => setEditKeywordId(null)}
              onSubmit={handleEditKeyword}
            />
          ) : null;
        })()}
      {showCompetitorModal && (
        <CompetitorModal
          folders={folders}
          baseKeywordId={selectedKeywordId}
          onClose={() => setShowCompetitorModal(false)}
        />
      )}
      <HelpButton />
    </div>
  );
}

export default Dashboard;
