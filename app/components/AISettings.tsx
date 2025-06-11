'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function AISettings({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [apiKey, setApiKey] = useState('');
  const [useAI, setUseAI] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('akash_api_key') || '';
      const savedUseAI = localStorage.getItem('use_ai') !== 'false';
      setApiKey(savedKey);
      setUseAI(savedUseAI);
    }
  }, []);

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('akash_api_key', apiKey);
      localStorage.setItem('use_ai', useAI.toString());
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleGetKey = () => {
    window.open('https://chatapi.akash.network/documentation', '_blank');
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-background-color border border-border-color rounded-lg p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-color">AI Assistant Settings</h3>
          <button
            onClick={onClose}
            className="text-muted-color hover:text-text-color transition-colors"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={useAI}
                onChange={(e) => setUseAI(e.target.checked)}
                className="rounded border-border-color"
              />
              <span className="text-sm text-text-color">Enable AI-powered responses</span>
            </label>
            <p className="text-xs text-muted-color">
              When enabled, uses Akash Network&apos;s AI to generate better responses based on your documentation.
            </p>
          </div>

          {useAI && (
            <div>
              <label className="block text-sm font-medium text-text-color mb-2">
                Akash API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-xxxxxxxx"
                className="w-full px-3 py-2 border border-border-color rounded-lg bg-card-background text-text-color placeholder-muted-color focus:outline-none focus:ring-2 focus:ring-primary-color focus:border-transparent"
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-muted-color">
                  Get a free API key from Akash Network
                </p>
                <button
                  onClick={handleGetKey}
                  className="text-xs text-primary-color hover:underline"
                >
                  Get API Key
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 pt-4">
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-primary-color text-white rounded-lg hover:bg-primary-color/90 transition-colors"
            >
              {saved ? 'Saved!' : 'Save Settings'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-border-color rounded-lg text-text-color hover:bg-card-background transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>

        {!useAI && (
          <div className="mt-4 p-3 bg-muted-color/10 rounded-lg">
            <p className="text-xs text-muted-color">
              When AI is disabled, the chatbot will use basic keyword matching to answer questions.
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
} 