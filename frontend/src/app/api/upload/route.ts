import { NextRequest, NextResponse } from 'next/server';
import { AwsClient } from 'aws4fetch';

// Type definition for the request body
interface UploadRequest {
  fileName: string;
  fileType: string;
}

// Initialize AWS client for R2
const aws = new AwsClient({
  accessKeyId: process.env.R2_ACCESS_KEY_ID!,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  region: 'auto',
  service: 's3',
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

    // Create the URL for the R2 object
    const objectUrl = new URL(`https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${process.env.R2_BUCKET_NAME}/${fileName}`);

    console.log('Object URL:', objectUrl.toString());

    // Generate pre-signed URL for PUT operation (expires in 10 minutes)
    const signedUrl = await aws.sign(objectUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': fileType,
      },
      aws: {
        signQuery: true,
      },
    });

    return NextResponse.json({
      signedUrl: signedUrl.url.toString(),
      fileName: fileName,
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
