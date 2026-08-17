export type Sentiment = 'positive' | 'negative' | 'neutral';

export type ImpactLevel =
  | '매우 좋음'
  | '좋음'
  | '다소 좋음'
  | '보통'
  | '다소 나쁨'
  | '나쁨'
  | '매우 나쁨';

export type KeywordCategory = '서비스' | '브랜드' | '회사' | '제품' | '인물' | '장소';

export const KEYWORD_CATEGORIES: KeywordCategory[] = ['서비스', '브랜드', '회사', '제품', '인물', '장소'];

export interface KeywordNode {
  id: string;
  name: string;
  totalIssues: number;
  positive: number;
  negative: number;
  channels: string[];
  category?: KeywordCategory;
  synonyms?: string[];
  excludeWords?: string[];
  collecting?: boolean;
}

export interface FolderNode {
  id: string;
  name: string;
  keywords: KeywordNode[];
}

export interface TrendPoint {
  time: string;
  positive: number;
  negative: number;
}

export interface IssueFactor {
  label: string;
  detail: string;
}

export interface IssueItem {
  id: string;
  keywordId: string;
  source: string;
  date: string;
  time: string;
  title: string;
  url: string;
  sentiment: Sentiment;
  confidence: number;
  summaryBullets: string[];
  category: string;
  tags: string[];
  inflowChannel: string;
  rawText?: string;
  isAd: boolean;
  impactLevels: ImpactLevel[];
  factors: IssueFactor[];
}

export interface InsightFactor {
  title: string;
  percent: number;
  description: string;
  effect: string;
}

export interface InsightData {
  keywordId: string;
  date: string;
  analyzedChannel: string;
  analyzedCount: number;
  avgRelevance: number;
  positiveKeywords: string[];
  negativeKeywords: string[];
  positiveFactors: InsightFactor[];
  negativeFactors: InsightFactor[];
  checkpoints: string[];
  conclusionSummary: string;
  conclusionNegative: string;
  conclusionPositive: string;
  conclusionClosing: string;
  sources: { date: string; title: string }[];
}

export interface ChannelDef {
  id: string;
  label: string;
}
