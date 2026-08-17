import { useState } from 'react';

interface TagListInputProps {
  label: string;
  placeholder: string;
  values: string[];
  onChange: (values: string[]) => void;
}

export function TagListInput({ label, placeholder, values, onChange }: TagListInputProps) {
  const [draft, setDraft] = useState('');

  function add() {
    const v = draft.trim();
    if (!v || values.includes(v)) return;
    onChange([...values, v]);
    setDraft('');
  }

  function remove(v: string) {
    onChange(values.filter((x) => x !== v));
  }

  return (
    <div style={{ marginBottom: 14 }}>
      <label className="field-label">{label}</label>
      <div className="tag-input-row">
        <input
          className="field-input"
          style={{ marginBottom: 0 }}
          placeholder={placeholder}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add();
            }
          }}
        />
        <button type="button" className="tag-add-btn" onClick={add} aria-label={`${label} 추가`}>
          +
        </button>
      </div>
      {values.length > 0 && (
        <div className="tag-chip-row">
          {values.map((v) => (
            <span className="tag-chip-removable" key={v}>
              {v}
              <button type="button" onClick={() => remove(v)} aria-label={`${v} 삭제`}>
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
