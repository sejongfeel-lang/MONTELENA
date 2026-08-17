export function GuideModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ width: 520 }} onClick={(e) => e.stopPropagation()}>
        <h3>📘 필수 가이드</h3>
        <p className="modal-hint">몬텔레나를 처음 쓰는 분들을 위한 핵심 사용 흐름입니다.</p>

        <ol className="overview-list" style={{ fontSize: 13, lineHeight: 2 }}>
          <li>
            <b>키워드 등록</b> — 좌측 상단 "+ 키워드 등록" 버튼으로 추적할 브랜드/서비스를 추가합니다.
          </li>
          <li>
            <b>키워드 정의 확인</b> — 등록 시 입력한 키워드 정의가 올바르게 설정되었는지 반드시 확인하세요. 정의가
            부정확하면 관련 없는 이슈가 섞여 들어올 수 있습니다.
          </li>
          <li>
            <b>최초 리포트 대기</b> — 최초 리포트는 등록 시점으로부터 약 24시간 후에 제공됩니다.
          </li>
          <li>
            <b>AI 실시간 감지 / 인사이트 / 종합리포트</b> — AI가 정제한 데이터를 확인할 수 있는 3가지 화면입니다.
          </li>
          <li>
            <b>슬랙 연동</b> — 좌측 하단 "설정" → "외부서비스 연동"에서 Slack Webhook을 등록하면 부정 이슈 발생 시
            팀 채널로 알림을 받을 수 있습니다.
          </li>
        </ol>

        <div className="modal-actions">
          <button className="btn btn-primary" onClick={onClose} style={{ flex: 'none', margin: '0 auto', padding: '10px 24px' }}>
            확인했어요
          </button>
        </div>
      </div>
    </div>
  );
}
