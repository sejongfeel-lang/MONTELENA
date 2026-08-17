import { useState } from 'react';
import { KEYWORD_CATEGORIES, type KeywordCategory, type KeywordNode } from '../types';
import { TagListInput } from './TagListInput';

export interface KeywordEditPayload {
  name: string;
  category: KeywordCategory;
  synonyms: string[];
  excludeWords: string[];
}

interface EditKeywordModalProps {
  keyword: KeywordNode;
  onClose: () => void;
  onSubmit: (payload: KeywordEditPayload) => void;
}

export function EditKeywordModal({ keyword, onClose, onSubmit }: EditKeywordModalProps) {
  const [name, setName] = useState(keyword.name);
  const [category, setCategory] = useState<KeywordCategory>(keyword.category ?? '브랜드');
  const [synonyms, setSynonyms] = useState<string[]>(keyword.synonyms ?? []);
  const [excludeWords, setExcludeWords] = useState<string[]>(keyword.excludeWords ?? []);
  const [showDetailHint, setShowDetailHint] = useState(false);

  const canSubmit = name.trim().length > 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-box-head">
          <h3>키워드 수정</h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="닫기">
            ✕
          </button>
        </div>

        <label className="field-label">키워드</label>
        <input className="field-input" value={name} onChange={(e) => setName(e.target.value)} />

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

        <div className="modal-actions">
          <button
            className="btn btn-primary"
            style={{ flex: 1 }}
            disabled={!canSubmit}
            onClick={() =>
              canSubmit && onSubmit({ name: name.trim(), category, synonyms, excludeWords })
            }
          >
            키워드 수정
          </button>
        </div>
      </div>
    </div>
  );
}
