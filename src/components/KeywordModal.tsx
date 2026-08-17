import { useState } from 'react';
import { KEYWORD_CATEGORIES, type FolderNode, type KeywordCategory } from '../types';
import { TagListInput } from './TagListInput';

export interface KeywordSubmitPayload {
  folderId: string;
  name: string;
  category: KeywordCategory;
  synonyms: string[];
  excludeWords: string[];
}

interface KeywordModalProps {
  folders: FolderNode[];
  onClose: () => void;
  onSubmit: (payload: KeywordSubmitPayload) => void;
}

export function KeywordModal({ folders, onClose, onSubmit }: KeywordModalProps) {
  const [folderId, setFolderId] = useState(folders[0]?.id ?? '');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<KeywordCategory>('브랜드');
  const [synonyms, setSynonyms] = useState<string[]>([]);
  const [excludeWords, setExcludeWords] = useState<string[]>([]);
  const [showDetailHint, setShowDetailHint] = useState(false);

  const canSubmit = name.trim().length > 0 && folderId;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-box-head">
          <h3>키워드 등록</h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="닫기">
            ✕
          </button>
        </div>
        <p className="modal-hint">최초 리포트는 등록 시점으로부터 약 24시간 후에 제공됩니다.</p>

        <label className="field-label">폴더</label>
        <select className="field-select" value={folderId} onChange={(e) => setFolderId(e.target.value)}>
          {folders.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>

        <label className="field-label">키워드</label>
        <input
          className="field-input"
          placeholder="예: 중계 CMS 교과"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="field-label">키워드 특성</label>
        <div className="category-pill-row">
          {KEYWORD_CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              className={`category-pill${c === category ? ' active' : ''}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="subsection-head">
          <span className="label">세부옵션(선택사항)</span>
          <button type="button" className="detail-toggle-btn" onClick={() => setShowDetailHint((v) => !v)}>
            세부설명
          </button>
        </div>
        {showDetailHint && (
          <p className="subsection-hint">
            동의어를 등록하면 같은 대상을 다르게 표기한 게시물도 함께 수집됩니다. 제외어를 등록하면 해당 단어가 포함된
            게시물은 분석에서 제외됩니다.
          </p>
        )}

        <TagListInput label="동의어" placeholder="동의어를 입력하세요." values={synonyms} onChange={setSynonyms} />
        <TagListInput label="제외어" placeholder="제외어를 입력하세요." values={excludeWords} onChange={setExcludeWords} />

        <p className="field-hint" style={{ marginTop: -4 }}>
          ⚠ 키워드 정의가 올바르게 설정되었는지 반드시 확인해주세요.
        </p>

        <div className="modal-actions">
          <button className="btn btn-outline" onClick={onClose}>
            취소
          </button>
          <button
            className="btn btn-primary"
            disabled={!canSubmit}
            style={!canSubmit ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
            onClick={() =>
              canSubmit &&
              onSubmit({ folderId, name: name.trim(), category, synonyms, excludeWords })
            }
          >
            키워드 등록
          </button>
        </div>
      </div>
    </div>
  );
}
