'use client';

import { useState } from 'react';
import { QrCode, Copy, Check, X } from 'lucide-react';

const DEMO_URL = 'ugc.cloudflaredemos.com';
const FULL_URL = `https://${DEMO_URL}`;

// QR code generated via QR Server API - large size for scanning from across the room
const QR_CODE_URL = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(FULL_URL)}&bgcolor=ffffff&color=000000&margin=10`;

export function JoinDemo() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(FULL_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="hidden md:block fixed top-4 right-4 z-50">
      {/* Collapsed: Just a button */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center space-x-2 bg-white border border-gray-200 shadow-lg rounded-full px-4 py-2 hover:shadow-xl transition-shadow"
        >
          <QrCode className="w-5 h-5 text-orange-500" />
          <span className="font-medium text-gray-700">Join Demo</span>
        </button>
      )}

      {/* Expanded: QR Code Panel */}
      {isExpanded && (
        <div className="bg-white border border-gray-200 shadow-2xl rounded-2xl p-5 w-125">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <QrCode className="w-5 h-5 text-orange-500" />
              <span className="font-semibold text-gray-800">Join the Demo</span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* QR Code */}
          <div className="bg-gray-50 p-3 rounded-xl mb-4 flex justify-center">
            <img
              src={QR_CODE_URL}
              alt={`QR code for ${DEMO_URL}`}
              className="w-96 h-96"
              width={500}
              height={500}
            />
          </div>

          {/* URL with Copy */}
          <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
            <span className="font-mono text-sm text-gray-700">
              {DEMO_URL}
            </span>
            <button
              onClick={copyToClipboard}
              className="p-1.5 hover:bg-gray-200 rounded transition-colors"
              title="Copy URL"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 text-gray-500" />
              )}
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-3">
            Scan to upload from your phone
          </p>
        </div>
      )}
    </div>
  );
}
