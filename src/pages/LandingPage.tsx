import { useState } from 'react';
import { Link } from 'react-router-dom';

const RANK_ROWS = [
  { rank: 1, change: 0, brand: '그린모아', score: 2, delta: 0, issue: '경제적 비용 부담' },
  { rank: 2, change: 0, brand: '다올제약', score: 3, delta: 0, issue: '소화 불편 가능성' },
  { rank: 3, change: 0, brand: '리브웰', score: 4, delta: -1, issue: '전월 대비 지수 하락' },
  { rank: 4, change: 0, brand: '코스트라인', score: 5, delta: 0, issue: '설정 과정 혼란' },
  { rank: 5, change: 1, brand: '포레스트몰', score: 6, delta: 0, issue: '브랜드 거부 요청' },
];

const INSIGHT_CARDS = [
  { category: '프로모션·할인', brand: '베스트카', quote: '보상쿠폰 환불불가', date: '2026-08-16' },
  { category: '평판', brand: '마루가구', quote: '그룹 적자', date: '2026-08-16' },
  { category: '품질', brand: '클린홈즈', quote: '서비스 장애 경험', date: '2026-08-16' },
  { category: '기타 의견', brand: '선한커피', quote: '운영 자금 부족', date: '2026-08-16' },
  { category: '기능·성능', brand: '네오테크', quote: '제조 어려움', date: '2026-08-16' },
];

const REVIEWS = [
  {
    quote: '몬텔레나 덕분에 이슈가 커지기 전에 사전 대응할 수 있었습니다. 위기관리 비용이 30% 이상 절감됐어요.',
    who: '김OO 팀장',
    org: 'A사 브랜드 전략팀 · 대기업 · PR',
  },
  {
    quote: '매일 아침 리포트 하나로 브랜드 상태를 파악합니다. 임원 보고가 훨씬 수월해졌어요.',
    who: '박OO 이사',
    org: 'B사 커뮤니케이션팀 · 대기업 · 홍보',
  },
  {
    quote: '경쟁사 이슈 모니터링 기능이 특히 유용해요. 시장 흐름을 빠르게 파악하는 데 결정적으로 도움이 됩니다.',
    who: '이OO 과장',
    org: 'C사 마케팅전략팀 · 중견기업 · 마케팅',
  },
  {
    quote: '슬랙 알림 연동 후 팀 전체가 실시간으로 이슈를 공유하게 됐습니다. 대응 속도가 눈에 띄게 달라졌어요.',
    who: '최OO 대리',
    org: 'D사 소셜미디어팀 · 스타트업 · SNS',
  },
];

const FEATURES = [
  { icon: '📡', title: '실시간 데이터 모니터링', desc: '24시간 365일 실시간 수집 및 분석' },
  { icon: '🤖', title: 'AI 기반 감성 분석', desc: '정확도 92% 이상의 AI 분석 연산' },
  { icon: '🔔', title: '이슈 조기 감지 알림', desc: '위험 정보 감지 시 즉시 알림' },
  { icon: '📄', title: '맞춤형 리포트 제공', desc: '기업별 맞춤 리포트 및 인사이트 제공' },
];

const TICKER = ['그린모아', '다올제약', '리브웰', '코스트라인', '포레스트몰', '베스트카', '마루가구', '클린홈즈', '선한커피', '네오테크'];

export function LandingPage() {
  const [company, setCompany] = useState('');

  return (
    <div className="landing">
      <header className="landing-nav">
        <div className="landing-nav-inner">
          <div className="brand">
            <img className="brand-mark" src="/logo-icon.svg" alt="" />
            몬텔레나
          </div>
          <nav className="landing-nav-links">
            <a href="#rank">브랜드 순위</a>
            <a href="#features">서비스 소개</a>
            <button className="link-btn" onClick={() => alert('필수 가이드는 대시보드 좌측 하단 "가이드" 버튼에서도 확인할 수 있어요.')}>
              필수 가이드
            </button>
            <a href="#cta">소개서 받기</a>
            <a href="#reviews">블로그</a>
          </nav>
          <div className="landing-nav-actions">
            <Link className="btn btn-outline" to="/app">
              로그인
            </Link>
            <Link className="btn btn-primary" to="/app">
              무료로 시작하기
            </Link>
          </div>
        </div>
      </header>

      <section className="landing-hero">
        <span className="pill-btn live" style={{ marginBottom: 14 }}>
          🔥 실시간 부정 이슈 업데이트
        </span>
        <h1>
          우리 회사에 발생되는
          <br />
          부정 이슈는 무엇일까요?
        </h1>
        <p>뉴스, SNS, 커뮤니티에서 실시간 분석하여 기업의 부정 이슈와 리스크를 빠르게 감지합니다.</p>

        <div className="landing-stat-row">
          <div>
            <div className="landing-stat-num">실시간 데이터</div>
            <div className="landing-stat-label">10,000+ 채널</div>
          </div>
          <div>
            <div className="landing-stat-num">AI 기반 감성 분석</div>
            <div className="landing-stat-label">정확도 92%</div>
          </div>
          <div>
            <div className="landing-stat-num">이슈 조기 감지 알림</div>
            <div className="landing-stat-label">실시간 알림</div>
          </div>
        </div>

        <Link to="/app" className="btn btn-primary" style={{ padding: '13px 26px', fontSize: 15 }}>
          우리 회사 리스크 확인하기 +
        </Link>
      </section>

      <section className="landing-section">
        <div className="panel landing-hot-card">
          <div>
            <div className="field-hint" style={{ margin: 0 }}>
              오늘 최대 상승 · 2026-08-16
            </div>
            <h3 style={{ margin: '6px 0' }}>{INSIGHT_CARDS[0] ? '그린모아' : ''}</h3>
            <div style={{ color: 'var(--red)', fontWeight: 700, fontSize: 13 }}>3단계 위험지수 상승중 🔥</div>
            <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>기타 의견으로 3단계 부정 이슈 상승중</p>
          </div>
          <div className="landing-hot-score">
            <div className="landing-stat-label">현재 위험지수</div>
            <div className="landing-hot-score-num">18</div>
            <div style={{ color: 'var(--red)', fontSize: 12, fontWeight: 700 }}>▲ 3 (15→18)</div>
          </div>
        </div>

        <div className="landing-ticker">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      </section>

      <section className="landing-section" id="rank">
        <h2 className="landing-section-title">브랜드 순위</h2>
        <div className="issue-table-wrap">
          <table className="issue-table" style={{ minWidth: 0 }}>
            <thead>
              <tr>
                <th>순위</th>
                <th>순위변화</th>
                <th>브랜드</th>
                <th>위험지수</th>
                <th>지수변화</th>
                <th>주요이슈</th>
              </tr>
            </thead>
            <tbody>
              {RANK_ROWS.map((r) => (
                <tr key={r.brand}>
                  <td>{r.rank}</td>
                  <td>{r.change}</td>
                  <td style={{ fontWeight: 700 }}>{r.brand}</td>
                  <td>{r.score}</td>
                  <td>{r.delta}</td>
                  <td>{r.issue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="field-hint" style={{ marginTop: 10 }}>
          위험지수는 점수가 낮을수록 위험도가 낮음을 의미합니다. 긍정·부정 분석 데이터를 기반으로 순위가 산출됩니다.
        </p>
      </section>

      <section className="landing-section">
        <h2 className="landing-section-title">주요 부정이슈 인사이트</h2>
        <div className="landing-insight-grid">
          {INSIGHT_CARDS.map((c) => (
            <div className="panel" key={c.brand}>
              <span className="sentiment-badge negative">부정 이슈</span>
              <div style={{ fontSize: 12, color: 'var(--text-faint)', margin: '10px 0 2px' }}>{c.category}</div>
              <div style={{ fontWeight: 800, marginBottom: 6 }}>{c.brand}</div>
              <div style={{ fontSize: 14, marginBottom: 10 }}>&ldquo;{c.quote}&rdquo;</div>
              <div style={{ fontSize: 11.5, color: 'var(--text-faint)' }}>{c.date} 실제 언급 →</div>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-section" id="reviews">
        <h2 className="landing-section-title">고객 후기</h2>
        <div className="landing-insight-grid">
          {REVIEWS.map((r) => (
            <div className="panel" key={r.who}>
              <p style={{ fontSize: 13.5, lineHeight: 1.7, marginBottom: 14 }}>&ldquo;{r.quote}&rdquo;</p>
              <div style={{ fontWeight: 700, fontSize: 13 }}>{r.who}</div>
              <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>{r.org}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-section" id="features">
        <h2 className="landing-section-title">몬텔레나는 부정 이슈와 리스크를 빠르게 감지합니다.</h2>
        <div className="landing-feature-grid">
          {FEATURES.map((f) => (
            <div className="panel" key={f.title} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-dim)' }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-cta" id="cta">
        <h2>
          지금, 우리 회사의
          <br />
          브랜드는 안전할까요?
        </h2>
        <div className="landing-cta-input">
          <input
            className="field-input"
            style={{ marginBottom: 0 }}
            placeholder="회사 또는 서비스 이름을 입력하세요."
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
          <Link className="btn btn-primary" to="/app" style={{ padding: '12px 22px' }}>
            무료로 리스크 확인하기
          </Link>
        </div>
      </section>

      <footer className="landing-footer">
        <p>몬텔레나는 고객의 소리를 가장 빠르고 정확하게 전달해드립니다.</p>
        <p>(주)몬텔레나 | 고객센터 문의는 우측 하단 도움말 버튼을 이용해주세요.</p>
      </footer>
    </div>
  );
}
