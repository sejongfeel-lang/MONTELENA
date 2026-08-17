import { useEffect, useState } from 'react';
import { fetchSettings, saveSettings } from '../api/client';
import type { ChannelDef } from '../types';

const STORAGE_KEY = 'binder-settings';

interface StoredSettings {
  slackWebhook: string;
  defaultChannels: string[];
  notifyOnNegative: boolean;
}

function loadLocalSettings(allChannelIds: string[]): StoredSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore malformed local storage */
  }
  return { slackWebhook: '', defaultChannels: allChannelIds, notifyOnNegative: true };
}

export function SettingsPanel({ channels, onBack }: { channels: ChannelDef[]; onBack: () => void }) {
  const [settings, setSettings] = useState<StoredSettings>(() => loadLocalSettings(channels.map((c) => c.id)));
  const [saved, setSaved] = useState(false);
  const [backendConnected, setBackendConnected] = useState(true);

  useEffect(() => {
    fetchSettings()
      .then((backend) => {
        setSettings((prev) => ({ ...prev, slackWebhook: backend.slackWebhook, notifyOnNegative: backend.notifyOnNegative }));
      })
      .catch(() => setBackendConnected(false));
  }, []);

  function persist(next: StoredSettings) {
    setSettings(next);
    setSaved(false);
  }

  async function handleSave() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    try {
      await saveSettings({ slackWebhook: settings.slackWebhook, notifyOnNegative: settings.notifyOnNegative });
      setBackendConnected(true);
    } catch {
      setBackendConnected(false);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function toggleChannel(id: string) {
    persist({
      ...settings,
      defaultChannels: settings.defaultChannels.includes(id)
        ? settings.defaultChannels.filter((c) => c !== id)
        : [...settings.defaultChannels, id],
    });
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">⚙️ 설정</h1>
          <p className="page-sub">계정, 수집 채널 기본값, 외부 서비스 연동을 관리합니다.</p>
        </div>
        <button className="btn btn-outline" onClick={onBack}>
          ← 대시보드로
        </button>
      </div>

      <div className="panel" style={{ maxWidth: 640, marginBottom: 20 }}>
        <div className="section-label">계정 정보</div>
        <label className="field-label">이메일</label>
        <input className="field-input" value="onecms.1997@gmail.com" disabled />
        <label className="field-label">플랜</label>
        <input className="field-input" value="Free" disabled />
      </div>

      <div className="panel" style={{ maxWidth: 640, marginBottom: 20 }}>
        <div className="section-label">기본 수집 채널</div>
        <p className="field-hint" style={{ margin: '0 0 12px' }}>
          새 키워드를 등록할 때 기본으로 켜질 채널을 선택하세요.
        </p>
        <div className="channel-grid">
          {channels.map((c) => (
            <label className="channel-chip" key={c.id}>
              <input
                type="checkbox"
                checked={settings.defaultChannels.includes(c.id)}
                onChange={() => toggleChannel(c.id)}
              />
              {c.label}
            </label>
          ))}
        </div>
      </div>

      <div className="panel" style={{ maxWidth: 640, marginBottom: 20 }}>
        <div className="section-label">외부서비스 연동 · Slack</div>
        <p className="field-hint" style={{ margin: '0 0 12px' }}>
          부정 이슈 감지 시 알림을 받을 Slack Incoming Webhook URL을 입력하세요. 백엔드가 실제로 이 주소로 알림을
          전송합니다.
        </p>
        {!backendConnected && (
          <p className="field-hint" style={{ color: 'var(--red)', marginTop: -6 }}>
            ⚠ 백엔드에 연결할 수 없어 지금은 브라우저에만 임시 저장됩니다. 백엔드가 켜지면 다시 저장해주세요.
          </p>
        )}
        <label className="field-label">Webhook URL</label>
        <input
          className="field-input"
          placeholder="https://hooks.slack.com/services/..."
          value={settings.slackWebhook}
          onChange={(e) => persist({ ...settings, slackWebhook: e.target.value })}
        />
        <label className="channel-chip" style={{ marginBottom: 14 }}>
          <input
            type="checkbox"
            checked={settings.notifyOnNegative}
            onChange={() => persist({ ...settings, notifyOnNegative: !settings.notifyOnNegative })}
          />
          부정 이슈 감지 시 알림 받기
        </label>
        <button className="btn btn-primary" onClick={handleSave}>
          {saved ? '✓ 저장됨' : '저장'}
        </button>
      </div>
    </>
  );
}
