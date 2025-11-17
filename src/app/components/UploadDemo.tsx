'use client';

import { useState, useCallback } from 'react';
import { Upload, CheckCircle, AlertCircle, Loader2, Image as ImageIcon, FileText } from 'lucide-react';

interface UploadStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'error';
}

export function UploadDemo() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadSteps, setUploadSteps] = useState<UploadStep[]>([
    {
      id: 'select',
      title: 'Select Image',
      description: 'Choose an image file to upload',
      status: 'pending'
    },
    {
      id: 'presign',
      title: 'Generate Pre-signed URL',
      description: 'Using Cloudflare Worker to create secure upload URL',
      status: 'pending'
    },
    {
      id: 'upload',
      title: 'Upload to R2',
      description: 'Direct upload to Cloudflare R2 storage',
      status: 'pending'
    },
    {
      id: 'complete',
      title: 'Upload Complete',
      description: 'File successfully stored in R2 bucket',
      status: 'pending'
    }
  ]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [showArchitecture, setShowArchitecture] = useState(false);

  const updateStepStatus = useCallback((stepId: string, status: UploadStep['status']) => {
    setUploadSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, status } : step
    ));
  }, []);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      updateStepStatus('select', 'completed');
      // Reset other steps
      ['presign', 'upload', 'complete'].forEach(id => updateStepStatus(id, 'pending'));
      setUploadedFileUrl(null);
    }
  }, [updateStepStatus]);

  const handleUpload = useCallback(async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    
    try {
      // Step 1: Generate pre-signed URL
      updateStepStatus('presign', 'active');
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: selectedFile.name,
          fileType: selectedFile.type,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get pre-signed URL');
      }

      const { signedUrl, fileName } = await response.json();
      updateStepStatus('presign', 'completed');

      // Step 2: Upload to R2
      updateStepStatus('upload', 'active');
      
      const uploadResponse = await fetch(signedUrl, {
        method: 'PUT',
        body: selectedFile,
        headers: {
          'Content-Type': selectedFile.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file');
      }

      updateStepStatus('upload', 'completed');
      updateStepStatus('complete', 'completed');
      
      // Generate the public URL (this would be your R2 public URL or custom domain)
      const publicUrl = `https://pub-${process.env.NEXT_PUBLIC_R2_ACCOUNT_ID || 'demo'}.r2.dev/${fileName}`;
      setUploadedFileUrl(publicUrl);

    } catch (error) {
      console.error('Upload failed:', error);
      const activeStep = uploadSteps.find(step => step.status === 'active');
      if (activeStep) {
        updateStepStatus(activeStep.id, 'error');
      }
    } finally {
      setIsUploading(false);
    }
  }, [selectedFile, uploadSteps, updateStepStatus]);

  const getStepIcon = (step: UploadStep) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'active':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
      {/* Left Side - Upload Interface */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Upload Image
        </h2>
        
        <div className="space-y-6">
          {/* File Selection */}
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
              disabled={isUploading}
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center space-y-4"
            >
              {selectedFile ? (
                <>
                  <ImageIcon className="w-12 h-12 text-green-500" />
                  <div>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-gray-400" />
                  <div>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      Choose an image to upload
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </>
              )}
            </label>
          </div>

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                <span>Upload to R2</span>
              </>
            )}
          </button>

          {/* Success Message */}
          {uploadedFileUrl && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-green-800 dark:text-green-200 font-medium">
                  Upload successful!
                </span>
              </div>
              <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                File uploaded to: {uploadedFileUrl}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Process Explanation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Upload Process
          </h2>
          <button
            onClick={() => setShowArchitecture(!showArchitecture)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            {showArchitecture ? 'Hide' : 'Show'} Architecture
          </button>
        </div>

        {showArchitecture && (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="w-5 h-5 text-blue-500" />
              <span className="font-medium text-gray-900 dark:text-white">Reference Architecture</span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <p>• Next.js App → API Route (/api/upload)</p>
              <p>• API Route → Cloudflare R2 (AWS SDK)</p>
              <p>• Pre-signed URL → Direct Browser Upload</p>
              <p>• Secure, scalable file storage solution</p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {uploadSteps.map((step, index) => (
            <div key={step.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                {getStepIcon(step)}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {step.description}
                </p>
                {step.status === 'active' && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full animate-pulse w-1/2"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {!selectedFile && (
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              <strong>Ready to demo:</strong> Choose an image on the left to see the secure upload process in action. 
              The right side will show each step as it happens in real-time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
