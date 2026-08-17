import { useState } from 'react';

export function HelpButton() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  function handleSend() {
    if (!message.trim()) return;
    setSent(true);
    setMessage('');
  }

  function handleClose() {
    setOpen(false);
    setSent(false);
  }

  return (
    <>
      <button className="help-fab" onClick={() => setOpen(true)} aria-label="도움말">
        💬
      </button>

      {open && (
        <div className="modal-overlay" onClick={handleClose}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>📝 서비스 문의하기</h3>
            {sent ? (
              <>
                <p className="modal-hint">문의가 접수되었습니다. 담당자가 신속하게 답변해드립니다.</p>
                <div className="modal-actions">
                  <button className="btn btn-primary" style={{ flex: 'none', margin: '0 auto', padding: '10px 24px' }} onClick={handleClose}>
                    확인
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="modal-hint">기능 사용 중 문의사항이 있으시면 남겨주세요. 담당자가 신속하게 답변해드립니다.</p>
                <label className="field-label">문의 내용</label>
                <textarea
                  className="field-input"
                  rows={4}
                  placeholder="궁금하신 내용을 입력해주세요"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <div className="modal-actions">
                  <button className="btn btn-outline" onClick={handleClose}>
                    취소
                  </button>
                  <button className="btn btn-primary" onClick={handleSend} disabled={!message.trim()}>
                    보내기
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
