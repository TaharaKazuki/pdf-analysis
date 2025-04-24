'use client';

import { useUser } from '@clerk/nextjs';
import { AlertCircle, CheckCircle, FileText } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
const DashboardContent = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const [showPaymentSuccess, setShowPaymentSuccess] = useState<boolean>(false);

  useEffect(() => {
    const isPaymentSuccess = searchParams.get('payment') === 'success';
    if (isPaymentSuccess) {
      setShowPaymentSuccess(true);
      router.replace('/dashboard');

      const timer = setTimeout(() => {
        setShowPaymentSuccess(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [searchParams, router]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError('');
    if (!e.target.files?.[0]) return;

    setSelectedFile(e.target.files[0]);
  };

  return (
    <>
      <div className="mx-auto mt-24 max-w-4xl space-y-10">
        {!showPaymentSuccess && (
          <div className="mx-auto my-8 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-green-400">
            <div className="flex items-center justify-center">
              <CheckCircle className="mr-2 h-5 w-5" />
              <p>Payment successfull! Your subscription is now active!</p>
            </div>
          </div>
        )}

        <div className="space-y-8 rounded-2xl border border-purple-300/10 bg-black/30 p-10 shadow-[0_4px_20px_-10px] shadow-purple-200/30">
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

          <button
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

        {!error && (
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
      </div>
    </>
  );
};

export default DashboardContent;
