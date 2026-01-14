
import React, { useState } from 'react';
import { DiseaseRecord, AIAnalysisResult } from '../types';
import { analyzeDiseaseData } from '../services/geminiService';
import { Sparkles, BrainCircuit, Code, Check, Copy, Loader2, Info } from 'lucide-react';

interface AIInsightsProps {
  records: DiseaseRecord[];
}

export const AIInsights: React.FC<AIInsightsProps> = ({ records }) => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [copied, setCopied] = useState(false);

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const result = await analyzeDiseaseData(records);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      alert("Analysis failed. Please ensure your API_KEY is valid.");
    } finally {
      setLoading(false);
    }
  };

  const copyScript = () => {
    if (analysis) {
      navigator.clipboard.writeText(analysis.googleAppsScript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      <div className="p-6 bg-gradient-to-r from-indigo-600 to-blue-700 text-white flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
            <BrainCircuit size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Epi-Intelligence Engine</h2>
            <p className="text-indigo-100 text-sm">Powered by Gemini AI for surveillance and automation</p>
          </div>
        </div>
        <button
          onClick={runAnalysis}
          disabled={loading || records.length === 0}
          className="bg-white text-indigo-700 px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-indigo-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
          {analysis ? 'Re-analyze Data' : 'Generate Health Insights & Script'}
        </button>
      </div>

      {!analysis && !loading && (
        <div className="p-12 text-center text-gray-500">
          <Info size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="max-w-md mx-auto">Click the button above to analyze your disease data. The AI will provide health summaries, risks, and a custom Google Apps Script for your spreadsheet.</p>
        </div>
      )}

      {loading && (
        <div className="p-12 text-center flex flex-col items-center">
          <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
          <p className="text-gray-600 font-medium animate-pulse">Scanning surveillance data and generating automation script...</p>
        </div>
      )}

      {analysis && !loading && (
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <section>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-bold text-gray-800 text-lg">Trend Summary</h3>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  analysis.riskLevel === 'High' ? 'bg-red-100 text-red-700' :
                  analysis.riskLevel === 'Medium' ? 'bg-orange-100 text-orange-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {analysis.riskLevel} Risk Level
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100 italic">
                "{analysis.summary}"
              </p>
            </section>

            <section>
              <h3 className="font-bold text-gray-800 text-lg mb-3">Health Recommendations</h3>
              <ul className="space-y-3">
                {analysis.recommendations.map((rec, i) => (
                  <li key={i} className="flex gap-3 items-start bg-indigo-50/50 p-3 rounded-lg text-indigo-900 border border-indigo-100">
                    <span className="bg-indigo-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">{i+1}</span>
                    <span className="text-sm font-medium">{rec}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section className="bg-gray-900 rounded-xl overflow-hidden flex flex-col border border-gray-800">
            <div className="px-4 py-3 bg-gray-800 flex justify-between items-center border-b border-gray-700">
              <div className="flex items-center gap-2 text-gray-300">
                <Code size={18} />
                <span className="text-sm font-mono font-semibold">google-apps-script.gs</span>
              </div>
              <button 
                onClick={copyScript}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors bg-white/5 px-2 py-1 rounded border border-white/10"
              >
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy Script'}
              </button>
            </div>
            <div className="p-4 flex-grow overflow-auto max-h-[400px]">
              <pre className="text-blue-300 font-mono text-xs leading-relaxed whitespace-pre-wrap">
                {analysis.googleAppsScript}
              </pre>
            </div>
            <div className="p-3 bg-indigo-900/40 text-indigo-200 text-[10px] italic border-t border-indigo-800">
              * Note: You can paste this directly into Extension > Apps Script in Google Sheets.
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
