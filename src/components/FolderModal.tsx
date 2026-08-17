import { useState } from 'react';

export function FolderModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (name: string) => void;
}) {
  const [name, setName] = useState('');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3>📁 폴더 생성</h3>
        <p className="modal-hint">키워드를 그룹으로 묶어 관리할 폴더를 만듭니다.</p>

        <label className="field-label">폴더명</label>
        <input
          className="field-input"
          placeholder="예: MG 남부"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="modal-actions">
          <button className="btn btn-outline" onClick={onClose}>
            취소
          </button>
          <button
            className="btn btn-primary"
            disabled={!name.trim()}
            style={!name.trim() ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
            onClick={() => name.trim() && onSubmit(name.trim())}
          >
            생성
          </button>
        </div>
      </div>
    </div>
  );
}
