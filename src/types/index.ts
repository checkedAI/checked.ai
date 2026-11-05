export type ScanType = 'text' | 'image' | 'website' | 'video' | 'audio' | 'file';

export type RiskLevel = 'safe' | 'suspicious' | 'high_risk' | 'unable_to_determine';

export interface ForensicIndicator {
  name: string;
  status: 'nominal' | 'warning' | 'alert';
  detail: string;
}

export interface ScanResult {
  id: string;
  type: ScanType;
  targetName: string;
  createdAt: string;
  status: RiskLevel;
  confidenceScore?: number; // 0 - 100 when supported
  confidenceJustification?: string;
  summary: string;
  explanation: string;
  indicators: ForensicIndicator[];
  repetitivePatterns?: string[];
  supportingReasons?: string[];
  modelUsed: string;
  isDemoMode: boolean;
  isBenchmark?: boolean;
  limitations: string[];
  metadata?: {
    wordCount?: number;
    charCount?: number;
    sentenceCount?: number;
    burstinessScore?: number;
    fileSize?: string;
    fileFormat?: string;
    domainAge?: string;
    sslValid?: boolean;
    duration?: string;
    fps?: number;
    frameCount?: number;
    sourceSnippet?: string;
    [key: string]: unknown;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'analyst' | 'user';
  avatar: string;
  plan: 'Free' | 'Pro' | 'Business';
  scansUsed: number;
  scansLimit: number;
  apiKey: string;
  autoPurgeDays: number;
}

export interface ServiceHealth {
  name: string;
  status: 'operational' | 'degraded' | 'offline';
  latencyMs: number;
  modelVersion: string;
  engine: string;
}

export interface AdminStats {
  totalUsers: number;
  totalScans: number;
  safeCount: number;
  suspiciousCount: number;
  highRiskCount: number;
  services: ServiceHealth[];
  recentAlerts: Array<{
    id: string;
    time: string;
    type: string;
    message: string;
    severity: 'low' | 'medium' | 'high';
  }>;
  errorLogs: Array<{
    id: string;
    time: string;
    endpoint: string;
    status: number;
    message: string;
  }>;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'security' | 'scan' | 'system';
}

export interface ApkInfo {
  appName: string;
  packageName: string;
  version: string;
  versionCode: number;
  size: string;
  minAndroid: string;
  targetAndroid: string;
  sha256: string;
  releaseDate: string;
  downloadUrl: string;
  directFileUrl: string;
  changelog: string[];
}

export interface DashboardStats {
  totalScans: number;
  liveScansCount: number;
  benchmarkScansCount: number;
  safeCount: number;
  suspiciousCount: number;
  highRiskCount: number;
  unableCount: number;
  isPersistent: boolean;
}

export interface ReferralStats {
  ready: boolean;
  status: 'coming_soon' | 'active';
  referralsSent: number;
  accountsCreated: number;
  verifiedScansCompleted: number;
  message: string;
}

