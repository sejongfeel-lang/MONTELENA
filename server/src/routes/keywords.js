import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import { readStore, writeStore } from '../db.js';
import { crawlKeywordById } from '../crawler.js';

export const keywordsRouter = Router();

keywordsRouter.get('/', (_req, res) => {
  const store = readStore();
  res.json(store.keywords);
});

keywordsRouter.post('/', (req, res) => {
  const { folderId, folderName, name, category, synonyms, excludeWords } = req.body ?? {};
  if (!folderId || !name) {
    return res.status(400).json({ error: 'folderId와 name은 필수입니다.' });
  }
  const store = readStore();
  const keyword = {
    id: randomUUID(),
    folderId,
    folderName: folderName ?? folderId,
    name,
    category: category ?? '브랜드',
    synonyms: Array.isArray(synonyms) ? synonyms : [],
    excludeWords: Array.isArray(excludeWords) ? excludeWords : [],
    createdAt: new Date().toISOString(),
  };
  store.keywords.push(keyword);
  writeStore(store);
  res.status(201).json(keyword);
});

keywordsRouter.patch('/:id', (req, res) => {
  const { name, category, synonyms, excludeWords } = req.body ?? {};
  const store = readStore();
  const keyword = store.keywords.find((k) => k.id === req.params.id);
  if (!keyword) return res.status(404).json({ error: '키워드를 찾을 수 없습니다.' });

  if (typeof name === 'string' && name.trim()) keyword.name = name.trim();
  if (typeof category === 'string') keyword.category = category;
  if (Array.isArray(synonyms)) keyword.synonyms = synonyms;
  if (Array.isArray(excludeWords)) keyword.excludeWords = excludeWords;
  writeStore(store);
  res.json(keyword);
});

keywordsRouter.delete('/:id', (req, res) => {
  const store = readStore();
  const exists = store.keywords.some((k) => k.id === req.params.id);
  if (!exists) return res.status(404).json({ error: '키워드를 찾을 수 없습니다.' });

  store.keywords = store.keywords.filter((k) => k.id !== req.params.id);
  store.issues = store.issues.filter((i) => i.keywordId !== req.params.id);
  writeStore(store);
  res.status(204).end();
});

keywordsRouter.get('/:id/issues', (req, res) => {
  const store = readStore();
  const issues = store.issues
    .filter((i) => i.keywordId === req.params.id)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  res.json(issues);
});

keywordsRouter.post('/:id/crawl', async (req, res) => {
  const result = await crawlKeywordById(req.params.id);
  if (!result.ok) return res.status(result.status).json({ error: result.error });
  const { ok: _ok, ...body } = result;
  res.json(body);
});
