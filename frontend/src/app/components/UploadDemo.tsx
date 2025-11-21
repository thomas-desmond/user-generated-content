"use client";

import { useState, useCallback } from "react";
import {
  Upload,
  Loader2,
  Image as ImageIcon,
  CircleCheck,
  Download,
} from "lucide-react";
import {
  ProcessStepGroup,
  type StepGroup,
  type UploadStep,
} from "./ProcessStepGroup";
import { defaultStepGroups } from "./workflowConfig";

export function UploadDemo() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [stepGroups, setStepGroups] = useState<StepGroup[]>(defaultStepGroups);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [displayImageUrl, setDisplayImageUrl] = useState<string | null>(null);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string | null>(null);

  const updateStepStatus = useCallback(
    (stepId: string, status: UploadStep["status"]) => {
      setStepGroups((prev) =>
        prev.map((group) => ({
          ...group,
          // Auto-expand Event Processing section when event-trigger is completed
          isCollapsed:
            group.id === "events" &&
            stepId === "event-trigger" &&
            status === "completed"
              ? false
              : group.isCollapsed,
          steps: group.steps.map((step) =>
            step.id === stepId ? { ...step, status } : step
          ),
        }))
      );
    },
    []
  );

  const toggleGroupCollapse = useCallback((groupId: string) => {
    setStepGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? { ...group, isCollapsed: !group.isCollapsed }
          : group
      )
    );
  }, []);

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Check if file is an image
      if (!file.type.startsWith("image/")) {
        alert(
          `Please select an image file. Selected file type: ${
            file.type || "unknown"
          }`
        );
        // Clear the input
        event.target.value = "";
        return;
      }

      // Check file size (8MB = 8 * 1024 * 1024 bytes)
      const maxSizeInBytes = 8 * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        alert(
          `File size must be 8MB or smaller. Your file is too big at ${(
            file.size /
            1024 /
            1024
          ).toFixed(2)}MB.`
        );
        // Clear the input
        event.target.value = "";
        return;
      }

      setSelectedFile(file);
      updateStepStatus("select", "completed");
      // Reset other steps
      [
        "presign",
        "upload",
        "complete",
        "download",
        "event-trigger",
        "workflow-started",
        "ai-processing",
        "ai-complete",
      ].forEach((id) => updateStepStatus(id, "pending"));
      setUploadedFileUrl(null);
      setUploadedFileName(null);
      setAiAnalysisResult(null);
      // Clean up previous image URL
      if (displayImageUrl) {
        URL.revokeObjectURL(displayImageUrl);
        setDisplayImageUrl(null);
      }
    },
    [updateStepStatus, displayImageUrl]
  );

  const handleUpload = useCallback(async () => {
    if (!selectedFile) return;

    setIsUploading(true);

    try {
      // Step 1: Generate pre-signed URL
      updateStepStatus("presign", "active");

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: selectedFile.name,
          fileType: selectedFile.type,
          fileSize: selectedFile.size,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get pre-signed URL");
      }

      const { signedUrl, fileName } = (await response.json()) as {
        signedUrl: string;
        fileName: string;
      };
      updateStepStatus("presign", "completed");

      // Step 2: Upload to R2
      updateStepStatus("upload", "active");

      const uploadResponse = await fetch(signedUrl, {
        method: "PUT",
        body: selectedFile,
        headers: {
          "Content-Type": selectedFile.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file");
      }

      updateStepStatus("upload", "completed");
      updateStepStatus("complete", "completed");
      updateStepStatus("download", "completed");

      // Step 1 of Event Processing: Event notification is automatically triggered by R2
      updateStepStatus("event-trigger", "completed");
      updateStepStatus("queue-batch", "completed");

      // Step 2 of Event Processing: Start polling for workflow instance creation
      // Add small delay to ensure Event Processing section expands before showing spinner
      setTimeout(() => {
        pollForWorkflowStart(fileName);
      }, 100);

      // Store the uploaded file information
      setUploadedFileName(fileName);
      // Generate the public URL (this would be your R2 public URL or custom domain)
      const publicUrl = `https://pub-${
        process.env.NEXT_PUBLIC_R2_ACCOUNT_ID || "demo"
      }.r2.dev/${fileName}`;
      setUploadedFileUrl(publicUrl);

      // Auto-fetch and display the image
      await fetchAndDisplayImage(fileName);
    } catch (error) {
      console.error("Upload failed:", error);
      // Find the active step in any group
      const activeStep = stepGroups
        .flatMap((group) => group.steps)
        .find((step) => step.status === "active");
      if (activeStep) {
        updateStepStatus(activeStep.id, "error");
      }
    } finally {
      setIsUploading(false);
    }
  }, [selectedFile, stepGroups, updateStepStatus]);

  const checkWorkflowStatus = useCallback(
    async (fileName: string) => {
      try {
        // Check if workflow instance exists in D1 database
        const response = await fetch("/api/workflow-status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileName: fileName,
          }),
        });

        if (response.ok) {
          const data = (await response.json()) as {
            instanceId?: string;
            workflowStarted?: boolean;
          };
          if (data.workflowStarted && data.instanceId) {
            // Workflow instance found in D1 database
            updateStepStatus("workflow-started", "completed");
            return true;
          }
        }
        return false;
      } catch (error) {
        console.error("Failed to check workflow status:", error);
        return false;
      }
    },
    [updateStepStatus]
  );

  const pollForWorkflowStart = useCallback(
    async (fileName: string) => {
      const maxAttempts = 30; // Poll for up to 15 seconds
      const pollInterval = 500; // 500ms intervals

      // Activate spinner on Workflow Instance Created step after event notification completes
      updateStepStatus("workflow-started", "active");

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const workflowStarted = await checkWorkflowStatus(fileName);
        if (workflowStarted) {
          // Once workflow starts, begin monitoring AI progress
          pollForAIProgress(fileName);
          return;
        }

        // Wait before next attempt
        await new Promise((resolve) => setTimeout(resolve, pollInterval));
      }

      // If we get here, workflow didn't start within timeout
      console.warn("Workflow instance not detected within timeout period");
      updateStepStatus("workflow-started", "error");
    },
    [checkWorkflowStatus, updateStepStatus]
  );

  const checkAIAnalysisComplete = useCallback(
    async (fileName: string) => {
      try {
        // Check if AI analysis results exist in D1 database
        const response = await fetch("/api/ai-analysis", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileName: fileName,
          }),
        });

        if (response.ok) {
          const data = (await response.json()) as {
            analysis?: string;
            analysisComplete?: boolean;
          };
          if (data.analysisComplete && data.analysis) {
            // AI analysis found in D1 database - mark as complete and store the result
            updateStepStatus("ai-processing", "completed");
            updateStepStatus("ai-complete", "completed");
            setAiAnalysisResult(data.analysis);
            return true;
          }
        }
        return false;
      } catch (error) {
        console.error("Failed to check AI analysis:", error);
        return false;
      }
    },
    [updateStepStatus, setAiAnalysisResult]
  );

  const pollForAIProgress = useCallback(
    async (fileName: string) => {
      const maxAttempts = 60; // Poll for up to 30 seconds
      const pollInterval = 500; // 500ms intervals

      // Mark AI processing as active immediately
      updateStepStatus("ai-processing", "active");

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        // Check if AI analysis is complete by looking at AI_ANALYSIS_KV
        const aiComplete = await checkAIAnalysisComplete(fileName);
        if (aiComplete) {
          return; // AI analysis complete, stop polling
        }

        // Wait before next attempt
        await new Promise((resolve) => setTimeout(resolve, pollInterval));
      }

      console.warn("AI analysis progress polling timed out");
    },
    [checkAIAnalysisComplete, updateStepStatus]
  );

  const fetchAndDisplayImage = useCallback(async (fileName: string) => {
    try {
      // Get pre-signed download URL
      const response = await fetch("/api/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: fileName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get download URL");
      }

      const { downloadUrl } = (await response.json()) as {
        downloadUrl: string;
      };

      // Fetch the actual image data
      const imageResponse = await fetch(downloadUrl);
      if (!imageResponse.ok) {
        throw new Error("Failed to fetch image");
      }

      // Create blob URL for display
      const blob = await imageResponse.blob();
      const blobUrl = URL.createObjectURL(blob);
      setDisplayImageUrl(blobUrl);
    } catch (error) {
      console.error("Failed to fetch and display image:", error);
      // Don't show error to user for auto-display, just log it
    }
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
      {/* Left Side - Upload Interface */}
      <div className="bg-white rounded-xl shadow-lg border border-orange-100/50 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-[#F6821F] to-[#FF6633] rounded-lg flex items-center justify-center">
            <Upload className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Secure File Upload
          </h2>
        </div>

        <div className="space-y-6">
          {/* File Selection */}
          <div className="border-2 border-dashed border-orange-100/80 rounded-xl p-8 text-center hover:border-orange-200 transition-colors bg-orange-50/10">
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
                    <p className="text-lg font-medium text-gray-900">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-gray-400" />
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      Choose an image to upload
                    </p>
                    <p className="text-sm text-gray-500">
                      PNG, JPG, GIF up to 8MB
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
            <div className="bg-gradient-to-r from-green-50/60 to-emerald-50/60 border border-green-100 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CircleCheck className="w-5 h-5 text-green-500" />
                  <span className="text-green-800 font-medium">
                    Upload successful!
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Display Downloaded Image */}
          {displayImageUrl && (
            <div className="border border-gray-100 rounded-xl p-4 bg-white shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Image Retrieved from R2
              </h3>
              <div className="flex justify-center">
                <img
                  src={displayImageUrl}
                  alt="Uploaded image preview"
                  className="max-w-full max-h-96 rounded-lg shadow-md object-contain"
                  onError={() => {
                    console.error("Failed to load image preview");
                    if (displayImageUrl) {
                      URL.revokeObjectURL(displayImageUrl);
                    }
                    setDisplayImageUrl(null);
                  }}
                />
              </div>
            </div>
          )}

          {/* Display AI Analysis Results */}
          {aiAnalysisResult && (
            <div className="border border-blue-100 rounded-xl p-4 bg-gradient-to-r from-blue-50/30 to-indigo-50/30 shadow-sm">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <ImageIcon className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  AI Analysis Results
                </h3>
              </div>
              <div className="bg-white/60 rounded-lg p-4 border border-blue-100/50">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {aiAnalysisResult}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Process Explanation */}
      <div className="bg-white rounded-xl shadow-sm border border-orange-50 p-6">
        <div className="mb-6 p-4 bg-gradient-to-r from-orange-50/20 to-red-50/20 border border-orange-100/60 rounded-lg">
          <p className="text-gray-700 text-sm leading-relaxed border-l-4 border-orange-500 pl-3">
            <strong>Interactive Demo:</strong> Upload an image to see the
            complete workflow in action.
            <br />
            <br />
            This demo uses pre-signed URL&apos;s to upload files directly to
            Cloudflare R2, and Cloudflare Workers to handle the upload process.
            R2 is configured to trigger an event notification when a new file is
            uploaded, which is first sent to a Cloudflare Queue, then processed
            inside of a Cloudflare Workflow. The Workflow generates an AI
            analysis of the image, and stores the results in Cloudflare D1.
          </p>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
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
