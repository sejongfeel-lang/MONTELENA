export async function notifySlack(webhookUrl, { keywordName, issue }) {
  if (!webhookUrl) return;

  const text = [
    `🚨 *부정 이슈 감지* — ${keywordName}`,
    `> ${issue.title}`,
    `출처: ${issue.source} · 신뢰도 ${issue.confidence}%`,
    issue.url && issue.url !== '#' ? issue.url : null,
  ]
    .filter(Boolean)
    .join('\n');

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text }),
    });
  } catch (err) {
    console.error('Slack 알림 전송 실패:', err.message);
  }
}
