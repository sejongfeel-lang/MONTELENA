import { useState, type ReactNode } from 'react';
import type { FolderNode } from '../types';
import type { HealthStatus } from '../api/client';

interface SidebarProps {
  folders: FolderNode[];
  selectedKeywordId: string;
  onSelectKeyword: (id: string) => void;
  onAddKeyword: () => void;
  onAddFolder: () => void;
  onOpenSettings: () => void;
  onOpenGuide: () => void;
  analyzedCount: number;
  analyzedTotal: number;
  homeLink?: ReactNode;
  health?: HealthStatus | null;
}

export function Sidebar({
  folders,
  selectedKeywordId,
  onSelectKeyword,
  onAddKeyword,
  onAddFolder,
  onOpenSettings,
  onOpenGuide,
  analyzedCount,
  analyzedTotal,
  homeLink,
  health,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggle = (id: string) =>
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));

  const percent = Math.min(100, Math.round((analyzedCount / analyzedTotal) * 100));

  return (
    <aside className="sidebar">
      <div className="brand">
        <img className="brand-mark" src="/logo-icon.svg" alt="" />
        {homeLink ?? '몬텔레나'}
      </div>

      <div className="sidebar-actions">
        <button className="btn btn-primary" onClick={onAddKeyword}>
          + 키워드 등록
        </button>
        <button className="btn btn-outline" onClick={onAddFolder}>
          📁 폴더 생성
        </button>
      </div>

      <nav className="folder-tree">
        {folders.map((folder) => (
          <div className="folder-group" key={folder.id}>
            <div className="folder-header" onClick={() => toggle(folder.id)}>
              <span>{collapsed[folder.id] ? '▸' : '▾'}</span>
              📂 {folder.name}
            </div>
            {!collapsed[folder.id] &&
              (folder.keywords.length === 0 ? (
                <div className="keyword-row-empty">등록된 키워드가 없습니다.</div>
              ) : (
                folder.keywords.map((k) => (
                  <div
                    key={k.id}
                    className={`keyword-row${k.id === selectedKeywordId ? ' active' : ''}`}
                    onClick={() => onSelectKeyword(k.id)}
                  >
                    <span className="keyword-row-text">
                      {k.name}
                      {k.collecting === false && <span className="paused-badge">수집 중단됨</span>}
                    </span>
                  </div>
                ))
              ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="progress-label">
          <span>AI 컨텐츠 분석</span>
          <span>
            {analyzedCount}/{analyzedTotal}개
          </span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${percent}%` }} />
        </div>
        <div className="sidebar-footer-links">
          <button className="btn btn-ghost" onClick={onOpenSettings}>
            ⚙️ 설정
          </button>
          <button className="btn btn-ghost" onClick={onOpenGuide}>
            📘 가이드
          </button>
        </div>
        <div className="backend-status">
          {health === undefined || health === null ? (
            <span>⏳ 백엔드 연결 확인 중…</span>
          ) : (
            <>
              <span className={health.ok ? 'dot-ok' : 'dot-off'} />
              백엔드 {health.ok ? '연결됨' : '연결 안 됨'} · 네이버 API{' '}
              {health.naverConfigured ? '✓' : '미설정'}
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
