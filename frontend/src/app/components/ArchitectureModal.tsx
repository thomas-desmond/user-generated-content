'use client';

import { useState } from 'react';
import { X, Maximize2, FileText, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  imagePath?: string;
  fallbackText?: string[];
}

export function ArchitectureModal({ isOpen, onClose, title, imagePath, fallbackText }: ArchitectureModalProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  if (!isOpen) return null;

  const shouldShowImage = imagePath && !imageError;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-2xl max-w-6xl max-h-[90vh] w-full mx-4 overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {shouldShowImage ? (
              <ImageIcon className="w-6 h-6 text-blue-500" />
            ) : (
              <FileText className="w-6 h-6 text-blue-500" />
            )}
            <h2 className="text-xl font-semibold text-gray-900">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* PNG Image Display */}
          {shouldShowImage && (
            <div className="mb-6">
              {imageLoading && (
                <div className="flex items-center justify-center h-64 bg-gray-100 rounded border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">Loading architecture diagram...</p>
                  </div>
                </div>
              )}
              <div className="flex justify-center">
                <img
                  src={imagePath}
                  alt={title}
                  className={`max-w-full h-auto rounded border border-gray-200 shadow-lg ${imageLoading ? 'hidden' : 'block'}`}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              </div>
            </div>
          )}

          {/* Error State */}
          {imagePath && imageError && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <span className="text-yellow-800">
                  Architecture diagram unavailable. Showing text reference below.
                </span>
              </div>
            </div>
          )}

          {/* Fallback Text or Additional Context */}
          {fallbackText && fallbackText.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Architecture Overview:</h3>
              <div className="text-gray-600 space-y-2">
                {fallbackText.map((line, index) => (
                  <p key={index} className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    {line.replace('• ', '')}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* No content available */}
          {!imagePath && (!fallbackText || fallbackText.length === 0) && (
            <div className="text-center py-12">
              <Maximize2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">
                Architecture diagram will be available soon.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
