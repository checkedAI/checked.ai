import React, { useState } from 'react';
import {
  CreditCard,
  Check,
  ShieldCheck,
  Zap,
  Building,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { UserProfile } from '../types';

interface PricingViewProps {
  profile: UserProfile | null;
  onUpdatePlan: (plan: 'Free' | 'Pro' | 'Business') => Promise<void>;
}

export const PricingView: React.FC<PricingViewProps> = ({
  profile,
  onUpdatePlan
}) => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const plans = [
    {
      id: 'Free',
      name: 'Free / Individual',
      target: 'For casual verification & independent creators',
      priceMonthly: 0,
      priceAnnual: 0,
      scanLimit: '25 Scans / month',
      features: [
        'Text AI Perplexity Analyzer',
        'Single Image Artifact Scan (up to 5MB)',
        'Standard SSRF-Safe Website Checks',
        'Standard Community Response Time',
        '7-Day Scan Audit History Retention'
      ],
      notIncluded: [
        'Deepfake Temporal Keyframe Inspection',
        'REST API & Webhooks Access',
        'Custom Cryptographic Certificates'
      ],
      cta: 'Current Baseline Plan'
    },
    {
      id: 'Pro',
      name: 'Pro / Professional',
      target: 'For intelligence analysts, editors & researchers',
      priceMonthly: 49,
      priceAnnual: 39,
      scanLimit: '500 Scans / month',
      popular: true,
      features: [
        'Multi-Layer Gemini 3.8 Flash Vision Engine',
        'High-Resolution Image Forensic Scans (up to 15MB)',
        'Video Temporal Landmark Deepfake Analysis',
        'Acoustic Lab Pre-release Audio Access',
        'REST API Token with Python FastAPI Support',
        'Cryptographic SHA-256 Audit Certificates',
        '30-Day Audit History with PDF Export'
      ],
      notIncluded: [
        'Dedicated Enterprise SLA & Custom Models'
      ],
      cta: 'Upgrade to Pro'
    },
    {
      id: 'Business',
      name: 'Business / Enterprise',
      target: 'For publishers, legal counsel & security teams',
      priceMonthly: 199,
      priceAnnual: 159,
      scanLimit: '5,000 Scans / month',
      features: [
        'Unlimited Batch Parallel Ingestion',
        'Dedicated Air-Gapped Sandbox Environment',
        'Custom Domain Threat Watchlists',
        'Full Forensic Audit Logs with Infinite Retention',
        'Priority GPU Inference Pipelines',
        'SSO / SAML Enterprise Identity Authentication',
        'Dedicated Technical Account Manager'
      ],
      notIncluded: [],
      cta: 'Contact Sales / Enterprise'
    }
  ];

  const handleSelectPlan = async (planId: 'Free' | 'Pro' | 'Business') => {
    setLoadingPlan(planId);
    try {
      await onUpdatePlan(planId);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          <CreditCard className="w-3.5 h-3.5" />
          <span>Configurable Enterprise Licensing</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Transparent, Predictable Verification Plans
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Choose the tier tailored to your content throughput. All plans adhere to zero-data-retention options and rigorous probabilistic forensic boundaries.
        </p>

        {/* In-page Billing Cadence Toggle */}
        <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl mt-4">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              billingPeriod === 'monthly'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingPeriod('annual')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              billingPeriod === 'annual'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Annual Billing</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrent = profile?.plan === plan.id;
          const price = billingPeriod === 'monthly' ? plan.priceMonthly : plan.priceAnnual;

          return (
            <div
              key={plan.id}
              className={`rounded-2xl border transition-all flex flex-col justify-between p-6 sm:p-7 relative bg-white ${
                plan.popular
                  ? 'border-indigo-500 shadow-md ring-1 ring-indigo-500'
                  : 'border-slate-200/90 shadow-xs'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs">
                  Most Popular
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{plan.target}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold font-mono text-slate-900 tabular-nums">
                    ${price}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    / month {billingPeriod === 'annual' && '(billed annually)'}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs font-mono font-semibold text-slate-700">
                  {plan.scanLimit}
                </div>

                <div className="space-y-2.5 pt-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Included Capabilities
                  </div>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.notIncluded.length > 0 && (
                    <div className="pt-2 text-xs text-slate-400 space-y-1">
                      {plan.notIncluded.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2 list-none">
                          <span className="w-4 text-center shrink-0">·</span>
                          <span className="line-through">{feat}</span>
                        </li>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100">
                <button
                  onClick={() => handleSelectPlan(plan.id as any)}
                  disabled={isCurrent || loadingPlan === plan.id}
                  className={`w-full py-2.5 px-4 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${
                    isCurrent
                      ? 'bg-slate-100 text-slate-500 cursor-default'
                      : plan.popular
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  {isCurrent ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Current Active Plan</span>
                    </>
                  ) : (
                    <span>{plan.cta}</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
