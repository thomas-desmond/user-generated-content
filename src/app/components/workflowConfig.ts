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
      // imagePath: '/diagrams/r2-upload-flow.png', // Will be added later
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
    description: 'Trigger workflows via event notifications',
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
        title: 'Trigger Event Notification',
        description: 'R2 upload triggers event notification',
        status: 'pending'
      },
      {
        id: 'queue-processing',
        title: 'Queue Processing',
        description: 'Event added to Cloudflare Queue for processing',
        status: 'pending'
      },
      {
        id: 'workflow-execution',
        title: 'Workflow Execution',
        description: 'Queue consumer triggers workflow execution',
        status: 'pending'
      }
    ]
  },
  {
    id: 'ai-analysis',
    title: 'AI Analysis',
    description: 'Intelligent content processing',
    isCollapsed: true,
    status: 'pending',
    architectureDiagram: {
      title: 'AI Processing Pipeline',
      // imagePath: '/diagrams/ai-analysis-flow.png', // Will be added later
      fallbackText: [
        '• Workflow → AI Workers',
        '• Image Analysis & Classification',
        '• Content Moderation & Insights',
        '• Results Storage & Notifications'
      ]
    },
    steps: [
      {
        id: 'image-analysis',
        title: 'Image Analysis',
        description: 'AI-powered image content analysis',
        status: 'pending'
      },
      {
        id: 'content-classification',
        title: 'Content Classification',
        description: 'Categorize and tag image content',
        status: 'pending'
      },
      {
        id: 'results-processing',
        title: 'Results Processing',
        description: 'Store analysis results and trigger notifications',
        status: 'pending'
      }
    ]
  }
];
