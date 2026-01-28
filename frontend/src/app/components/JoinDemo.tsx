'use client';

import { useState, useEffect } from 'react';
import { QrCode, X, Smartphone, Copy, Check, Share2 } from 'lucide-react';

const DEMO_URL = 'ugc.cloudflaredemos.com';
const FULL_URL = `https://${DEMO_URL}`;

// QR code generated via QR Server API - simple and reliable
const QR_CODE_URL = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(FULL_URL)}&bgcolor=ffffff&color=000000&margin=10`;

export function JoinDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile on mount (client-side only)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(FULL_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Cloudflare UGC Demo',
          text: 'Try this User-Generated Content demo - upload a photo and watch AI analyze it!',
          url: FULL_URL,
        });
      } catch (err) {
        // User cancelled or share failed - fall back to copy
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <>
      {/* Floating Button - hidden on mobile since they're already on the demo */}
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex fixed bottom-6 right-6 bg-gradient-to-r from-[#F6821F] to-[#FF6633] hover:from-[#FF6633] hover:to-[#F6821F] text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 items-center space-x-2 z-40"
      >
        <QrCode className="w-5 h-5" />
        <span className="font-medium">Join Demo</span>
      </button>

      {/* Mobile: Show a "Share" button instead - lets them send the link to others */}
      <button
        onClick={handleShare}
        className="md:hidden fixed bottom-4 right-4 bg-gradient-to-r from-[#F6821F] to-[#FF6633] text-white p-3 rounded-full shadow-lg z-40"
        aria-label="Share demo"
      >
        <Share2 className="w-5 h-5" />
      </button>

      {/* Modal Overlay - only shown on desktop */}
      {isOpen && !isMobile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden border border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-red-50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[#F6821F] to-[#FF6633] rounded-xl flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Join the Demo
                  </h2>
                  <p className="text-sm text-gray-500">
                    Scan or visit the URL below
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col items-center">
              {/* QR Code */}
              <div className="bg-white p-4 rounded-xl border-2 border-gray-100 shadow-sm mb-5">
                <img
                  src={QR_CODE_URL}
                  alt={`QR code for ${DEMO_URL}`}
                  className="w-64 h-64"
                  width={256}
                  height={256}
                />
              </div>

              {/* URL with Copy Button */}
              <div className="w-full flex items-center justify-center space-x-2 bg-gray-50 rounded-xl p-3 border border-gray-200">
                <span className="text-lg font-mono font-medium text-gray-800">
                  {DEMO_URL}
                </span>
                <button
                  onClick={copyToClipboard}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Copy URL"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-500" />
                  )}
                </button>
              </div>

              {/* Call to Action */}
              <p className="mt-4 text-center text-gray-600 text-sm">
                Upload a photo from your phone and watch the AI analyze it!
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
