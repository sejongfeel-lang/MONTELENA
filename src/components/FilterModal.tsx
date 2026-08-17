import { useState } from 'react';

export interface FilterSettings {
  includeAds: boolean;
  relevanceThreshold: number;
}

export const DEFAULT_FILTER_SETTINGS: FilterSettings = {
  includeAds: true,
  relevanceThreshold: 10,
};

const RELEVANCE_OPTIONS = [10, 30, 50, 70, 90];

export function FilterModal({
  value,
  onClose,
  onConfirm,
}: {
  value: FilterSettings;
  onClose: () => void;
  onConfirm: (value: FilterSettings) => void;
}) {
  const [includeAds, setIncludeAds] = useState(value.includeAds);
  const [relevanceThreshold, setRelevanceThreshold] = useState(value.relevanceThreshold);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-box-head">
          <h3>필터 설정</h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="닫기">
            ✕
          </button>
        </div>
        <p className="modal-hint">
          AI인사이트, AI종합리포트 데이터 생성시 사용자가 설정한 조건으로 맞춤형 보고서를 만들어 드립니다.
        </p>

        <div className="section-label" style={{ marginTop: 18 }}>
          데이터 속성
        </div>
        <p className="field-hint" style={{ margin: '0 0 12px' }}>
          일반 컨텐츠만 분석할지 광고성 컨텐츠도 포함하여 분석할지 선택할 수 있습니다.
        </p>
        <label className="radio-option">
          <input type="radio" name="includeAds" checked={!includeAds} onChange={() => setIncludeAds(false)} />
          <span>
            일반 컨텐츠만 분석 <span className="radio-sub">(순수 뉴스나 정보성 글만 분석)</span>
          </span>
        </label>
        <label className="radio-option">
          <input type="radio" name="includeAds" checked={includeAds} onChange={() => setIncludeAds(true)} />
          <span>
            광고성 컨텐츠도 포함해서 분석{' '}
            <span className="radio-sub">(브랜드 홍보기사, 광고성 블로그도 분석)</span>
          </span>
        </label>

        <hr className="modal-divider" />

        <div className="section-label">관련성</div>
        <p className="field-hint" style={{ margin: '0 0 12px' }}>
          관련성 기준값을 설정하여 컨텐츠를 분석할 수 있습니다.
        </p>
        <select
          className="field-select"
          value={relevanceThreshold}
          onChange={(e) => setRelevanceThreshold(Number(e.target.value))}
        >
          {RELEVANCE_OPTIONS.map((v) => (
            <option key={v} value={v}>
              {v}% 이상
            </option>
          ))}
        </select>

        <div className="modal-actions">
          <button className="btn btn-outline" onClick={onClose}>
            취소
          </button>
          <button className="btn btn-primary" onClick={() => onConfirm({ includeAds, relevanceThreshold })}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
