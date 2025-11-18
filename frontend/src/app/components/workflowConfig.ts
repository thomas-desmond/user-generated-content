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
        '• Next.js App → API Route (/api/upload)',
        '• API Route → Cloudflare R2 (AWS SDK)',
        '• Pre-signed URL → Direct Browser Upload',
        '• Secure, scalable file storage solution'
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
      // imagePath: '/diagrams/event-processing-flow.png', // Will be added later
      fallbackText: [
        '• R2 Upload → Event Notifications',
        '• Event Notifications → Cloudflare Queue',
        '• Queue → Workflow Trigger',
        '• Asynchronous, scalable processing'
      ]
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
