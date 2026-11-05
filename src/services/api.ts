import { ScanResult, UserProfile, AdminStats, NotificationItem, ApkInfo, DashboardStats, ReferralStats } from '../types';

export const api = {
  async getProfile(): Promise<UserProfile> {
    const res = await fetch('/api/v1/user/profile');
    const data = await res.json();
    return data.profile;
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    const res = await fetch('/api/v1/user/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    return data.profile;
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const res = await fetch('/api/v1/dashboard/stats');
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to fetch dashboard stats');
    return data.stats;
  },

  async getScans(filter?: { type?: string; status?: string }): Promise<ScanResult[]> {
    const params = new URLSearchParams();
    if (filter?.type && filter.type !== 'all') params.append('type', filter.type);
    if (filter?.status && filter.status !== 'all') params.append('status', filter.status);

    const res = await fetch(`/api/v1/scans?${params.toString()}`);
    const data = await res.json();
    return data.scans || [];
  },

  async getScan(id: string): Promise<ScanResult> {
    const res = await fetch(`/api/v1/scans/${id}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to fetch scan');
    return data.scan;
  },

  async getReport(id: string): Promise<ScanResult & { digitalFingerprint: string; disclaimer: string; verificationAuthority: string }> {
    const res = await fetch(`/api/v1/reports/${id}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to fetch report');
    return data.report;
  },

  async deleteScan(id: string): Promise<void> {
    const res = await fetch(`/api/v1/scans/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to delete scan');
  },

  async scanText(text: string, title?: string): Promise<ScanResult> {
    const res = await fetch('/api/v1/scan/text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, title })
    });
    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error || 'Text analysis failed. Please verify input and retry.');
    }
    return data.scan;
  },

  async scanImage(imageBase64: string, mimeType: string, filename: string): Promise<ScanResult> {
    const res = await fetch('/api/v1/scan/image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64, mimeType, filename })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Image scan failed');
    return data.scan;
  },

  async scanWebsite(url: string): Promise<ScanResult> {
    const res = await fetch('/api/v1/scan/website', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Website scan failed');
    return data.scan;
  },

  async scanVideo(filename: string, duration?: string, fileSize?: string): Promise<ScanResult> {
    const res = await fetch('/api/v1/scan/video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename, duration, fileSize })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Video scan failed');
    return data.scan;
  },

  async scanAudio(filename: string, fileSize?: string): Promise<ScanResult> {
    const res = await fetch('/api/v1/scan/audio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename, fileSize })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Audio scan failed');
    return data.scan;
  },

  async scanFile(filename: string, fileSize?: string, fileType?: string): Promise<ScanResult> {
    const res = await fetch('/api/v1/scan/file', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename, fileSize, fileType })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'File scan failed');
    return data.scan;
  },

  async getAdminStats(): Promise<AdminStats> {
    const res = await fetch('/api/v1/admin/stats');
    const data = await res.json();
    return data.stats;
  },

  async getNotifications(): Promise<NotificationItem[]> {
    const res = await fetch('/api/v1/notifications');
    const data = await res.json();
    return data.notifications || [];
  },

  async getApkInfo(): Promise<ApkInfo> {
    const res = await fetch('/api/v1/apk/info');
    const data = await res.json();
    return data.apk;
  },

  async getReferralStats(): Promise<ReferralStats> {
    const res = await fetch('/api/v1/referrals/stats');
    const data = await res.json();
    return data.stats;
  }
};
