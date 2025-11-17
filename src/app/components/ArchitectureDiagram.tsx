'use client';

import { useState } from 'react';
import { FileText, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface ArchitectureDiagramProps {
  title: string;
  imagePath?: string;
  fallbackText?: string[];
}

export function ArchitectureDiagram({ title, imagePath, fallbackText }: ArchitectureDiagramProps) {
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

  // If we have an image path and no error, try to show the image
  const shouldShowImage = imagePath && !imageError;
  
  // Show fallback text if no image path, image failed to load, or as backup
  const shouldShowFallback = !imagePath || imageError || !fallbackText;

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <div className="flex items-center space-x-2 mb-3">
        {shouldShowImage ? (
          <ImageIcon className="w-5 h-5 text-blue-500" />
        ) : (
          <FileText className="w-5 h-5 text-blue-500" />
        )}
        <span className="font-medium text-gray-900 dark:text-white">{title}</span>
      </div>

      {/* PNG Image Display */}
      {shouldShowImage && (
        <div className="mb-3">
          {imageLoading && (
            <div className="flex items-center justify-center h-32 bg-gray-100 dark:bg-gray-600 rounded border-2 border-dashed border-gray-300 dark:border-gray-500">
              <div className="text-center">
                <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Loading architecture diagram...</p>
              </div>
            </div>
          )}
          <img
            src={imagePath}
            alt={title}
            className={`max-w-full h-auto rounded border border-gray-200 dark:border-gray-600 ${imageLoading ? 'hidden' : 'block'}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </div>
      )}

      {/* Error State */}
      {imagePath && imageError && (
        <div className="mb-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-yellow-600" />
            <span className="text-sm text-yellow-800 dark:text-yellow-200">
              Architecture diagram unavailable. Showing text reference below.
            </span>
          </div>
        </div>
      )}

      {/* Fallback Text or Additional Context */}
      {fallbackText && fallbackText.length > 0 && (
        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
          {fallbackText.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      )}

      {/* No content available */}
      {!imagePath && (!fallbackText || fallbackText.length === 0) && (
        <div className="text-sm text-gray-500 dark:text-gray-400 italic">
          Architecture diagram will be available soon.
        </div>
      )}
    </div>
  );
}
