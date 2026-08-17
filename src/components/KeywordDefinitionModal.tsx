import type { KeywordNode } from '../types';

export function KeywordDefinitionModal({
  keyword,
  onClose,
  onEdit,
}: {
  keyword: KeywordNode;
  onClose: () => void;
  onEdit: () => void;
}) {
  const synonyms = keyword.synonyms ?? [];
  const excludeWords = keyword.excludeWords ?? [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-box-head">
          <h3>🔍 키워드 정의</h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="닫기">
            ✕
          </button>
        </div>
        <p className="modal-hint">올바르게 키워드가 들어갔는지 확인해주세요.</p>

        <label className="field-label">키워드</label>
        <div className="definition-view">{keyword.name}</div>

        <label className="field-label" style={{ marginTop: 14 }}>
          키워드 특성
        </label>
        <div className="category-pill-row">
          <span className="category-pill active">{keyword.category ?? '브랜드'}</span>
        </div>

        <label className="field-label">동의어</label>
        {synonyms.length > 0 ? (
          <div className="tag-chip-row" style={{ marginTop: 0, marginBottom: 14 }}>
            {synonyms.map((s) => (
              <span className="tag-chip-static" key={s}>
                {s}
              </span>
            ))}
          </div>
        ) : (
          <div className="definition-view" style={{ marginBottom: 14 }}>
            등록된 동의어가 없습니다.
          </div>
        )}

        <label className="field-label">제외어</label>
        {excludeWords.length > 0 ? (
          <div className="tag-chip-row" style={{ marginTop: 0 }}>
            {excludeWords.map((s) => (
              <span className="tag-chip-static" key={s}>
                {s}
              </span>
            ))}
          </div>
        ) : (
          <div className="definition-view">등록된 제외어가 없습니다.</div>
        )}

        <div className="modal-actions">
          <button className="btn btn-outline" onClick={onClose}>
            닫기
          </button>
          <button className="btn btn-primary" onClick={onEdit}>
            ✎ 수정하기
          </button>
        </div>
      </div>
    </div>
  );
}
