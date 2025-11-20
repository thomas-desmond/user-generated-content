import { type StepGroup } from './ProcessStepGroup';

export const defaultStepGroups: StepGroup[] = [
  {
    id: 'upload',
    title: 'File Upload',
    description: 'Secure upload to Cloudflare R2',
    isCollapsed: false,
    status: 'pending',
    architectureDiagram: {
      title: 'R2 Upload Architecture',
      imagePath: '/secure-user-uploads.png',
      fallbackText: [
        'User initiates upload from the frontend: The app collects file details (e.g. size, name) and calls a backend API (a Cloudflare Worker) to begin the upload process.',
        'Worker authenticates the user and validates the request: The Worker confirms that the user is logged in, has upload permissions, and that the file is within acceptable limits (for example, 10MB max, allowed MIME types).',
        'Worker returns a signed PUT URL to R2: A signed URL allows the frontend to upload directly to R2 for a limited time, under a specific key or namespace. There is no need for the Worker to handle large files directly.',
        'Frontend uploads the file directly to R2: The file is streamed directly from the client to R2.',
        '(Optional) Trigger post-upload workflows: R2 offers event notifications to send messages to a queue when data in your R2 bucket changes, like a new upload. Example post-processing: Scan, moderate, or transform the file, write metadata (for example, user_id, file_path, timestamp) to D1, Cloudflare\'s serverless SQL database, notify the user or update a dashboard/UI.',
      ]
    },
    steps: [
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
      },
      {
        id: 'download',
        title: 'Download Available',
        description: 'Generate secure download URL for file access',
        status: 'pending'
      }
    ]
  },
  {
    id: 'events',
    title: 'Event Processing',
    description: 'Automated workflow triggered by upload events',
    isCollapsed: true,
    status: 'pending',
    architectureDiagram: {
      title: 'Event-Driven Architecture',
      imagePath: '/upload-event-processing.png',
      fallbackText: []
    },
    steps: [
      {
        id: 'event-trigger',
        title: 'Event Notification Triggered',
        description: 'R2 upload automatically triggers event notification',
        status: 'pending'
      },
      {
        id: 'workflow-started',
        title: 'Workflow Instance Created',
        description: 'Event processed and workflow instance started',
        status: 'pending'
      },
      {
        id: 'ai-processing',
        title: 'AI Analysis in Progress',
        description: 'Image being analyzed by AI model',
        status: 'pending'
      },
      {
        id: 'ai-complete',
        title: 'AI Analysis Complete',
        description: 'Image analysis results stored successfully',
        status: 'pending'
      }
    ]
  }
];
