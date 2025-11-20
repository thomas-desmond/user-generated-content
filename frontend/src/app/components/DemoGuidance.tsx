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
        <div className="absolute bottom-16 right-0 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-h-96 overflow-y-auto">
          <div className="flex items-center space-x-2 mb-4">
            <Lightbulb className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Demo Guidance</h3>
          </div>

          <div className="space-y-4 text-sm">
            <div className="p-3 bg-gradient-to-r from-orange-50 to-red-50  rounded-lg">
              <div className="flex items-start space-x-2">
                <MessageSquare className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-900 border-b border-orange-500 pb-1">Key Talking Points</h4>
                  <ul className="text-gray-700 mt-1 space-y-1 text-xs">
                    <li>• Zero egress fees save significant costs</li>
                    <li>• S3-compatible APIs for easy migration</li>
                    <li>• Global edge performance</li>
                    <li>• Scales beyond simple uploads</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-3 bg-gradient-to-r from-red-50 to-orange-50  rounded-lg">
              <div className="flex items-start space-x-2">
                <Target className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-900 border-b border-red-500 pb-1">Demo Flow</h4>
                  <ol className="text-gray-700 mt-1 space-y-1 text-xs">
                    <li>1. Show UGC context (expandable)</li>
                    <li>2. Upload image to demonstrate</li>
                    <li>3. Highlight architecture diagrams</li>
                    <li>4. Discuss broader use cases</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="p-3 bg-gradient-to-r from-orange-50 to-red-50  rounded-lg">
              <div className="flex items-start space-x-2">
                <TrendingUp className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-900 border-b border-orange-500 pb-1">Customer Examples</h4>
                  <ul className="text-gray-700 mt-1 space-y-1 text-xs">
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
