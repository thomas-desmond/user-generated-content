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

## Project Structure

This repository contains two main projects that work together to create a complete UGC processing pipeline:

### Frontend (`/frontend/`)
A **Next.js application** that provides the user-facing interface for the UGC demo. This interactive web application allows users to:

- Upload files through an intuitive drag-and-drop interface
- View real-time progress tracking during upload and processing
- Monitor workflow execution status with live updates
- Explore educational content about Cloudflare's UGC architecture
- See AI analysis results once processing is complete

The frontend communicates with Cloudflare services through API routes handling file uploads, progress tracking, and real-time status updates.

### Workflow Backend (`/upload-event-workflow/`)
A **Cloudflare Worker with Workflows** that handles the server-side event processing pipeline. This backend service:

- Processes R2 event notifications triggered by file uploads with a queue consumer Worker
- Manages durable Cloudflare Workflow execution for reliable multi-step processing
- Integrates with Workers AI to analyze uploaded content
- Stores analysis results in Cloudflare D1 database
- Automatically handles error recovery and retry logic for robust processing

The workflow backend demonstrates how to build resilient, event-driven processing systems using Cloudflare's serverless infrastructure, ensuring reliable handling of user-generated content at scale.

## Use Case

Showcase how to upload content to Cloudflare R2 via pre-signed URL. Then kickoff an R2 event notification. Batch the events in a Cloudflare Queue, then handle the events in a Cloudflare Workflow. The Workflow uses a Workers AI image to text model to analyze the image and store the results in a Cloudflare D1 database.

User Upload → Pre-signed URL → R2 Storage → Event Notification → Queue → Workflow → AI Analysis → D1 Database

## Deploy it yourself

We'll be taking advantage of the "Deploy To Cloudflare" button to deploy the frontend and workflow backend. 

Note: By using the Deploy to Cloudflare button you will create two separate GitHub repositories. One for the frontend and one for the workflow backend. Breaking up the Monorepository into two separate repositories.

### Deploy the Next.js frontend

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/thomas-desmond/user-generated-content/tree/main/frontend)

When choosing deployment options:
 - Create a new D1 database
 - Create a new R2 bucket
 - The `Build Command` can be left blank
 - All other default options are fine


### Deploy the Cloudflare Worker with Workflows

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/thomas-desmond/user-generated-content/tree/main/upload-event-workflow)

When choosing deployment options:
 - If it doesn't auto-pick the D1 database from the step before, select it from the list
 - If it doesn't auto-pick the R2 bucket from the step before, select it from the list
 - Create a new Queue
 - All other default options are fine

### Extra Configuration

#### D1 Database Setup

- The `db.sql` inside the /upload-event-workflow/ directory needs to be executed on the D1 database to create the necessary table.
- Navigate to the D1 database in the Cloudflare Dashboard
- Go to the `Console` tab
- Paste in the CREATE TABLE statement from the `db.sql` file
- Click `Execute`
- Your D1 database should now have a WorkflowTracking table

#### R2 Setup

- R2 Event Notification Setup
  - Navigate to your new R2 bucket in the Cloudflare Dashboard
  - Go to `Settings` tab.
  - Find `Event Notifications` and add a new one
  - Choose the queue that was created earlier & trigger on `Creation of new Object` event

- R2 CORS Setup
  - In R2 Settings find `CORS Policy`
  - Add the following CORS policy replacing the `AllowedOrigins` section with the URL of the frontend application that was deployed. Make sure there are no trailing slashes in the URL (/)

```
[
  {
    "AllowedOrigins": [
      "https://your-application-url.com"
    ],
    "AllowedMethods": [
      "GET",
      "PUT",
      "POST",
      "DELETE",
      "HEAD"
    ],
    "AllowedHeaders": [
      "*"
    ],
    "ExposeHeaders": [
      "ETag"
    ],
    "MaxAgeSeconds": 3600
  }
]
```


- Create and Apply R2 API Keys https://developers.cloudflare.com/r2/api/tokens/
  - Navigate to the overview page for all of your R2 Buckets
  - Fine the API Tokens section and choose `Manage`
  - Create an Account Token
  - Choose `Object Read & Write` permissions
  - Choose the bucket you created 
  - Create the token
  - Save the `Access Key ID` & `Secret Access Key`

- Add Environment Variables to Frontend Worker
  -  Go to the Settings for the frontend Worker that you created and edit/rotate the following Secrets with the values you created or can be found in r2 settings
  - `R2_ACCOUNT_ID`=your_cloudflare_account_id
  - `R2_ACCESS_KEY_ID`=your_r2_access_key_id
  - `R2_SECRET_ACCESS_KEY`=your_r2_secret_access_key
  - `R2_BUCKET_NAME`=your-bucket-name
  - `R2_ENDPOINT`=found in r2 bucket settings under general it's the `S3 API` value.
  - Deploy the Application once all keys are input