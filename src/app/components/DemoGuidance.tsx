'use client';

import { useState } from 'react';
import { Eye, EyeOff, Lightbulb, MessageSquare, Target, TrendingUp } from 'lucide-react';

export function DemoGuidance() {
  const [isVisible, setIsVisible] = useState(false);

  // Only show in development or when explicitly enabled
  const shouldShow = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_SHOW_SE_GUIDANCE === 'true';

  if (!shouldShow) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-gradient-to-r from-[#F6821F] to-[#FF6633] hover:from-[#FF6633] hover:to-[#F6821F] text-white p-3 rounded-full shadow-lg transition-all duration-200"
        title="Toggle SE Guidance"
      >
        {isVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>

      {isVisible && (
        <div className="absolute bottom-16 right-0 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 p-4 max-h-96 overflow-y-auto">
          <div className="flex items-center space-x-2 mb-4">
            <Lightbulb className="w-5 h-5 text-[#F6821F]" />
            <h3 className="font-semibold text-gray-900 dark:text-white">SE Demo Guidance</h3>
          </div>

          <div className="space-y-4 text-sm">
            <div className="p-3 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg">
              <div className="flex items-start space-x-2">
                <MessageSquare className="w-4 h-4 text-[#F6821F] mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-[#F6821F] dark:text-orange-100">Key Talking Points</h4>
                  <ul className="text-[#F6821F] dark:text-orange-200 mt-1 space-y-1 text-xs">
                    <li>• Zero egress fees save significant costs</li>
                    <li>• S3-compatible APIs for easy migration</li>
                    <li>• Global edge performance</li>
                    <li>• Scales beyond simple uploads</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-3 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg">
              <div className="flex items-start space-x-2">
                <Target className="w-4 h-4 text-[#FF6633] mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-[#FF6633] dark:text-orange-100">Demo Flow</h4>
                  <ol className="text-[#FF6633] dark:text-orange-200 mt-1 space-y-1 text-xs">
                    <li>1. Show UGC context (expandable)</li>
                    <li>2. Upload image to demonstrate</li>
                    <li>3. Highlight architecture diagrams</li>
                    <li>4. Discuss broader use cases</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="p-3 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg">
              <div className="flex items-start space-x-2">
                <TrendingUp className="w-4 h-4 text-[#F6821F] mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-[#F6821F] dark:text-orange-100">Customer Examples</h4>
                  <ul className="text-[#F6821F] dark:text-orange-200 mt-1 space-y-1 text-xs">
                    <li>• E-commerce: Product photos, reviews</li>
                    <li>• Social: User posts, AI-generated content</li>
                    <li>• Enterprise: Collaborative documents</li>
                    <li>• Creative: Design tools, media creation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
