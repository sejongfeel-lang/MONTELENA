import { Router } from 'express';
import { readStore, writeStore } from '../db.js';

export const settingsRouter = Router();

settingsRouter.get('/', (_req, res) => {
  const store = readStore();
  res.json(store.settings);
});

settingsRouter.put('/', (req, res) => {
  const { slackWebhook, notifyOnNegative } = req.body ?? {};
  const store = readStore();
  if (typeof slackWebhook === 'string') store.settings.slackWebhook = slackWebhook;
  if (typeof notifyOnNegative === 'boolean') store.settings.notifyOnNegative = notifyOnNegative;
  writeStore(store);
  res.json(store.settings);
});
