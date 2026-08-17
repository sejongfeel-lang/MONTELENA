import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { naverConfigured } from './naver.js';
import { keywordsRouter } from './routes/keywords.js';
import { settingsRouter } from './routes/settings.js';
import { startScheduler } from './scheduler.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    naverConfigured: naverConfigured(),
    anthropicConfigured: Boolean(process.env.ANTHROPIC_API_KEY),
  });
});

app.use('/api/keywords', keywordsRouter);
app.use('/api/settings', settingsRouter);

const port = process.env.PORT || 8787;
app.listen(port, () => {
  console.log(`brand-monitor backend listening on http://localhost:${port}`);
  console.log(`Naver API configured: ${naverConfigured()}`);
  console.log(`Anthropic API configured: ${Boolean(process.env.ANTHROPIC_API_KEY)}`);
  startScheduler();
});
