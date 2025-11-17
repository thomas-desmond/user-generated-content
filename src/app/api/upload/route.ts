import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Type definition for the request body
interface UploadRequest {
  fileName: string;
  fileType: string;
}

// Initialize S3 client for R2
const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  }
});

export async function POST(request: NextRequest) {
  try {
    // Debug environment variables (remove in production)
    console.log('Environment check:', {
      hasEndpoint: !!process.env.R2_ENDPOINT,
      hasAccessKey: !!process.env.R2_ACCESS_KEY_ID,
      hasSecretKey: !!process.env.R2_SECRET_ACCESS_KEY,
      hasBucketName: !!process.env.R2_BUCKET_NAME,
      endpoint: process.env.R2_ENDPOINT?.substring(0, 20) + '...' // Partial for security
    });

    const { fileName, fileType } = await request.json() as UploadRequest;

    if (!fileName || !fileType) {
      return NextResponse.json(
        { error: 'fileName and fileType are required' },
        { status: 400 }
      );
    }

    // Generate unique file name with timestamp
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}-${fileName}`;

    // Create the command for putting an object
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: uniqueFileName,
      ContentType: fileType,
    });

    // Generate pre-signed URL (expires in 10 minutes)
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 600 });

    return NextResponse.json({
      signedUrl,
      fileName: uniqueFileName,
      bucketName: process.env.R2_BUCKET_NAME,
    });
  } catch (error) {
    console.error('Error generating pre-signed URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate pre-signed URL' },
      { status: 500 }
    );
  }
}
