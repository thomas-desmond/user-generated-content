# User-Generated Content Demo

A comprehensive demonstration of scalable, cost-efficient user-generated content (UGC) management using Cloudflare's serverless platform. This demo showcases how modern applications can handle file uploads, processing, and AI analysis with zero egress fees and global performance.

### Key Components

1. **Next.js Frontend** - Interactive upload interface with real-time progress tracking
2. **Cloudflare R2** - S3-compatible object storage with zero egress fees
3. **Cloudflare Workers** - Serverless functions for upload handling and API endpoints
4. **Cloudflare Workflows** - Durable execution for multi-step processing
5. **Cloudflare Queues** - Event-driven messaging for reliable processing
6. **Cloudflare D1** - Serverless SQL database for metadata and results
7. **Cloudflare AI** - Built-in AI models for content analysis

## 🎯 Use Case

Showcase how to upload content to Cloudflare R2 via pre-signed URL. Then kickoff an R2 event notification. Batch the events in a Cloudflare Queue, then handle the events in a Cloudflare Workflow. The Workflow uses a Workers AI image to text model to analyze the image and store the results in a Cloudflare D1 database.

User Upload → Pre-signed URL → R2 Storage → Event Notification → Queue → Workflow → AI Analysis → D1 Database
