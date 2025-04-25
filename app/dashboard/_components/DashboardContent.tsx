'use client';

import { useUser } from '@clerk/nextjs';
import { AlertCircle, CheckCircle, FileText } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { extractTextFromPDF } from '@/lib/pdfUtils';

export default function DashboardContent() {
  const { user, isLoaded } = useUser();

  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);

  useEffect(() => {
    const isPaymentSuccess = searchParams?.get('payment') === 'success';

    if (isPaymentSuccess) {
      setShowPaymentSuccess(true);
      router.replace('/dashboard');

      const timer = setTimeout(() => {
        setShowPaymentSuccess(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [searchParams, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');

    if (!e.target.files?.[0]) return;

    setSelectedFile(e.target.files[0]);
  };

  //TODO: handleAnalyze function
  const handleAnalyze = useCallback(async () => {
    if (!selectedFile) {
      setError('Please select a file before analyzing.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSummary('');

    try {
      const text = await extractTextFromPDF(selectedFile);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ text: text.substring(0, 10000) }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();

      setSummary(data.summary || 'No summary was generated.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze PDF.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedFile]);

  const formatSummaryContent = (text: string) => {
    const paragraphs = text.split('\n').filter((p) => p.trim() !== '');

    return paragraphs.map((paragraph, index) => {
      if (paragraph.startsWith('# ')) {
        return (
          <h2
            key={index}
            className="mt-6 mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-2xl font-bold text-transparent"
          >
            {paragraph.replace(/^# /, '')}
          </h2>
        );
      }

      if (paragraph.startsWith('## ')) {
        return (
          <h3
            key={index}
            className="mt-6 mb-3 border-b border-purple-500/20 pb-2 text-xl font-semibold text-purple-300"
          >
            {paragraph.replace(/^## /, '')}
          </h3>
        );
      }

      return (
        <p
          key={index}
          className="mb-4 leading-relaxed text-gray-300 transition-colors first-letter:text-lg first-letter:font-medium hover:text-white"
        >
          {paragraph}
        </p>
      );
    });
  };

  return (
    <div className="mx-auto mt-24 min-h-[300vh] max-w-4xl space-y-10">
      {showPaymentSuccess && (
        <div className="mx-auto my-8 max-w-xl rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-green-400">
          <div className="flex items-center justify-center">
            <CheckCircle className="mr-4 h-5 w-5" />
            <p>Payment successfull! Your subscription is now active!</p>
          </div>
        </div>
      )}

      {/* File upload and analysis section */}
      <div className="space-y-8 rounded-2xl border border-purple-300/10 bg-black/30 p-10 shadow-[0_4px_20px_-10px] shadow-purple-200/30">
        {/* File input for PDF selection */}
        <div className="relative">
          <div className="my-2 ml-2 flex items-center text-xs text-gray-500">
            <FileText className="mr-1.5 h-3.5 w-3.5" />
            <span>Supported format: PDF</span>
          </div>
          <div className="rounded-xl border border-gray-700 bg-black/40 p-1 transition-colors hover:border-purple-200/20">
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf"
              className="block w-full cursor-pointer text-gray-300 transition-all file:mr-4 file:rounded-lg file:border-0 file:bg-purple-200/20 file:px-6 file:py-3 file:text-sm file:font-medium file:text-purple-200 hover:file:bg-purple-200/20 focus:outline-none"
            />
          </div>
        </div>

        {/* Analyze button - disabled when no file selected or during loading */}
        <button
          onClick={handleAnalyze}
          disabled={!selectedFile || isLoading}
          className="group relative inline-flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-4 text-white transition-all hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FF1E56] via-[#FF00FF] to-[#00FFFF] opacity-70 blur-sm transition-all group-hover:opacity-100 disabled:opacity-40" />
          <span className="absolute inset-0.5 rounded-xl bg-black/50" />
          <span className="relative font-medium">
            {isLoading ? 'Processing...' : 'Analyze Document'}
          </span>
        </button>
      </div>

      {/* Error message - only shown when there's an error */}
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
          <div className="flex items-start">
            <AlertCircle className="mt-0.5 mr-2 h-5 w-5" />
            <div>
              <p className="mb-1 font-medium">Error analyzing document</p>
              <p>{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Summary results - only shown when there's a summary */}
      {summary && (
        <div className="rounded-2xl border border-[#2A2A35] bg-black/20 p-8 shadow-[0_4px_20px_-10px] shadow-purple-200/30">
          {/* Summary header */}
          <div className="mb-6 flex items-center">
            <div className="mr-3 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-2">
              <FileText className="h-6 w-6 text-purple-400" />
            </div>
          </div>

          {/* Formatted summary content */}
          <div className="max-w-none rounded-xl border border-[#2A2A35] bg-[#0f0f13] px-6 py-5">
            {formatSummaryContent(summary)}
          </div>
        </div>
      )}
    </div>
  );
}
