'use client';

import { useState, useCallback } from 'react';
import { Upload, Loader2, Image as ImageIcon, CircleCheck, Download } from 'lucide-react';
import { ProcessStepGroup, type StepGroup, type UploadStep } from './ProcessStepGroup';
import { defaultStepGroups } from './workflowConfig';

export function UploadDemo() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [stepGroups, setStepGroups] = useState<StepGroup[]>(defaultStepGroups);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [displayImageUrl, setDisplayImageUrl] = useState<string | null>(null);

  const updateStepStatus = useCallback((stepId: string, status: UploadStep['status']) => {
    setStepGroups(prev => prev.map(group => ({
      ...group,
      steps: group.steps.map(step => 
        step.id === stepId ? { ...step, status } : step
      )
    })));
  }, []);

  const toggleGroupCollapse = useCallback((groupId: string) => {
    setStepGroups(prev => prev.map(group => 
      group.id === groupId ? { ...group, isCollapsed: !group.isCollapsed } : group
    ));
  }, []);


  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      updateStepStatus('select', 'completed');
      // Reset other steps
      ['presign', 'upload', 'complete', 'download'].forEach(id => updateStepStatus(id, 'pending'));
      setUploadedFileUrl(null);
      setUploadedFileName(null);
      // Clean up previous image URL
      if (displayImageUrl) {
        URL.revokeObjectURL(displayImageUrl);
        setDisplayImageUrl(null);
      }
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
      updateStepStatus('download', 'completed');
      
      // Store the uploaded file information
      setUploadedFileName(fileName);
      // Generate the public URL (this would be your R2 public URL or custom domain)
      const publicUrl = `https://pub-${process.env.NEXT_PUBLIC_R2_ACCOUNT_ID || 'demo'}.r2.dev/${fileName}`;
      setUploadedFileUrl(publicUrl);
      
      // Auto-fetch and display the image
      await fetchAndDisplayImage(fileName);

    } catch (error) {
      console.error('Upload failed:', error);
      // Find the active step in any group
      const activeStep = stepGroups
        .flatMap(group => group.steps)
        .find(step => step.status === 'active');
      if (activeStep) {
        updateStepStatus(activeStep.id, 'error');
      }
    } finally {
      setIsUploading(false);
    }
  }, [selectedFile, stepGroups, updateStepStatus]);

  const handleDownload = useCallback(async () => {
    if (!uploadedFileName) return;

    setIsDownloading(true);
    
    try {
      // Get pre-signed download URL
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: uploadedFileName,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get download URL');
      }

      const { downloadUrl } = await response.json();
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = uploadedFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download file. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  }, [uploadedFileName]);

  const fetchAndDisplayImage = useCallback(async (fileName: string) => {
    try {
      // Get pre-signed download URL
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: fileName,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get download URL');
      }

      const { downloadUrl } = await response.json();
      
      // Fetch the actual image data
      const imageResponse = await fetch(downloadUrl);
      if (!imageResponse.ok) {
        throw new Error('Failed to fetch image');
      }
      
      // Create blob URL for display
      const blob = await imageResponse.blob();
      const blobUrl = URL.createObjectURL(blob);
      setDisplayImageUrl(blobUrl);

    } catch (error) {
      console.error('Failed to fetch and display image:', error);
      // Don't show error to user for auto-display, just log it
    }
  }, []);


  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
      {/* Left Side - Upload Interface */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-orange-100/50 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-[#F6821F] to-[#FF6633] rounded-lg flex items-center justify-center">
            <Upload className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Secure File Upload
          </h2>
        </div>
        
        <div className="space-y-6">
          {/* File Selection */}
          <div className="border-2 border-dashed border-orange-100/80 dark:border-gray-600 rounded-xl p-8 text-center hover:border-orange-200 dark:hover:border-[#F6821F] transition-colors bg-orange-50/10 dark:bg-gray-700/20">
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
            className="w-full bg-gradient-to-r from-[#F6821F] to-[#FF6633] hover:from-[#FF6633] hover:to-[#F6821F] disabled:from-gray-400 disabled:to-gray-400 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl disabled:shadow-none"
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
            <div className="bg-gradient-to-r from-green-50/60 to-emerald-50/60 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-100 dark:border-green-800 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CircleCheck  className="w-5 h-5 text-green-500" />
                  <span className="text-green-800 dark:text-green-200 font-medium">
                    Upload successful!
                  </span>
                </div>
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="bg-gradient-to-r from-[#F6821F] to-[#FF6633] hover:from-[#FF6633] hover:to-[#F6821F] disabled:from-gray-400 disabled:to-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center space-x-2 text-sm shadow-md hover:shadow-lg disabled:shadow-none"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Downloading...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-sm text-green-600 dark:text-green-300 mt-2">
                File uploaded to: {uploadedFileUrl}
              </p>
            </div>
          )}

          {/* Display Downloaded Image */}
          {displayImageUrl && (
            <div className="border border-gray-100 dark:border-gray-600 rounded-xl p-4 bg-white dark:bg-gray-700/20 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Image Retrieved from R2
              </h3>
              <div className="flex justify-center">
                <img
                  src={displayImageUrl}
                  alt="Uploaded image preview"
                  className="max-w-full max-h-96 rounded-lg shadow-md object-contain"
                  onError={() => {
                    console.error('Failed to load image preview');
                    if (displayImageUrl) {
                      URL.revokeObjectURL(displayImageUrl);
                    }
                    setDisplayImageUrl(null);
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Process Explanation */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-orange-50 dark:border-gray-700 p-6">
        {!selectedFile && (
          <div className="mb-6 p-4 bg-gradient-to-r from-orange-50/20 to-red-50/20 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-100/60 dark:border-[#F6821F]/50 rounded-lg">
            <p className="text-[#F6821F] dark:text-orange-200 text-sm leading-relaxed">
              <strong>Interactive Demo:</strong> Upload an image to see the complete secure workflow in action. 
              This infrastructure pattern scales from individual uploads to enterprise-level content management, 
              supporting everything from user photos to AI-generated media with zero egress fees.
            </p>
          </div>
        )}
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Workflow Process
        </h2>

        <div className="space-y-4">
          {stepGroups.map((group) => (
            <ProcessStepGroup
              key={group.id}
              group={group}
              onToggleCollapse={toggleGroupCollapse}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
