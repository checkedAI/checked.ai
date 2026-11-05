import React, { useState } from 'react';
import {
  Settings,
  Key,
  Shield,
  Trash2,
  Copy,
  Check,
  Save,
  Terminal,
  Code2,
  RefreshCw,
  Database,
  Lock
} from 'lucide-react';
import { UserProfile } from '../types';

interface SettingsViewProps {
  profile: UserProfile | null;
  onUpdateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  profile,
  onUpdateProfile
}) => {
  const [name, setName] = useState(profile?.name || 'Checked AI');
  const [dataRetention, setDataRetention] = useState(true);
  const [autoPurgeDays, setAutoPurgeDays] = useState(profile?.autoPurgeDays || 1);
  const [copiedKey, setCopiedKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showFastApiDocs, setShowFastApiDocs] = useState(false);

  const apiKey = profile?.apiKey || 'chk_live_84f932ab04c7d91e6e';

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateProfile({
      name,
      autoPurgeDays
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const fastApiCodeSnippet = `# checked_ai_service.py - Production Python FastAPI Integration
from fastapi import FastAPI, HTTPException, Header, UploadFile, File
from pydantic import BaseModel, HttpUrl
from typing import Optional, List
import os

app = FastAPI(
    title="Checked AI Verification Engine",
    version="1.4.0",
    description="REST API for AI content verification, deepfake detection & threat analysis."
)

class TextScanRequest(BaseModel):
    text: str
    title: Optional[str] = None

class WebsiteScanRequest(BaseModel):
    url: str

class ForensicIndicator(BaseModel):
    name: str
    status: str # "nominal" | "warning" | "alert"
    detail: str

class ScanResponse(BaseModel):
    id: str
    type: str
    status: str # "safe" | "suspicious" | "high_risk" | "unable_to_determine"
    confidence_score: Optional[float]
    summary: str
    explanation: str
    indicators: List[ForensicIndicator]
    model_used: str

@app.post("/api/v1/scan/text", response_model=ScanResponse)
async def scan_text(payload: TextScanRequest, authorization: Optional[str] = Header(None)):
    # Verify Bearer token against database
    # Execute linguistic perplexity & burstiness evaluation
    return {
        "id": "scn_txt_demo",
        "type": "text",
        "status": "safe",
        "confidence_score": 88.0,
        "summary": "Probabilistic assessment indicates natural linguistic variance.",
        "explanation": "Calculated sentence length variance and token entropy distributions.",
        "indicators": [{"name": "Burstiness", "status": "nominal", "detail": "High std deviation"}],
        "model_used": "Checked-Linguistic V3.8"
    }

@app.post("/api/v1/scan/website")
async def scan_website(payload: WebsiteScanRequest):
    # Enforce SSRF protection: reject private IP ranges & loopback
    return {"status": "safe", "url": payload.url}
`;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
          <Settings className="w-4 h-4" />
          <span>Checked AI · Account & Platform Governance</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          System & Account Settings
        </h1>
        <p className="text-sm text-slate-600 mt-0.5">
          Manage your analyst profile, API credentials, privacy retention policies, and backend integration.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-600" />
            <span>Analyst Identity & Credentials</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Assigned Role
              </label>
              <input
                type="text"
                disabled
                value="Security Analyst (RBAC Level 3)"
                className="w-full px-3.5 py-2 text-xs bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* API Credentials */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Key className="w-4 h-4 text-indigo-600" />
                <span>REST API Access Token</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Use this token to authenticate programmatic scans via Python FastAPI or curl.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowFastApiDocs(!showFastApiDocs)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
            >
              <Code2 className="w-4 h-4" />
              <span>{showFastApiDocs ? 'Hide FastAPI Code' : 'View FastAPI Router Code'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs">
            <span className="flex-1 truncate select-all text-slate-800">
              {apiKey}
            </span>
            <button
              type="button"
              onClick={handleCopyKey}
              className="p-1.5 text-slate-600 hover:text-indigo-600 transition-colors"
              title="Copy API Token"
            >
              {copiedKey ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {showFastApiDocs && (
            <div className="mt-3 p-4 bg-slate-950 text-slate-200 rounded-xl font-mono text-xs overflow-x-auto space-y-2 border border-slate-800">
              <div className="text-[11px] text-indigo-400 font-bold uppercase tracking-wider">
                Python FastAPI Implementation Scaffold:
              </div>
              <pre className="text-[11px] leading-relaxed text-slate-300">
                {fastApiCodeSnippet}
              </pre>
            </div>
          )}
        </div>

        {/* Privacy & Data Retention */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-600" />
            <span>Privacy-Conscious Data Retention</span>
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            In compliance with strict data minimization mandates, Checked AI automatically purges uploaded text, images, and document binaries immediately after feature extraction.
          </p>

          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <div className="text-xs font-bold text-slate-800">
                Automatic Binary Payload Purge
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Retain only mathematical feature vectors and SHA-256 audit hashes.
              </div>
            </div>

            <input
              type="checkbox"
              checked={dataRetention}
              onChange={(e) => setDataRetention(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {saved && (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <Check className="w-4 h-4" />
              <span>Settings updated successfully</span>
            </span>
          )}
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
