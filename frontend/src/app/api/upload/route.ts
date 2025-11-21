import { NextRequest, NextResponse } from 'next/server';
import { AwsClient } from 'aws4fetch';

interface UploadRequest {
  fileName: string;
  fileType: string;
}

const aws = new AwsClient({
  accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
  region: 'auto',
  service: 's3',
});

export async function POST(request: NextRequest) {
  try {
    const { fileName, fileType } = await request.json() as UploadRequest;

    if (!fileName || !fileType) {
      return NextResponse.json(
        { error: 'fileName and fileType are required' },
        { status: 400 }
      );
    }

    const objectUrl = new URL(`https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${process.env.R2_BUCKET_NAME}/${fileName}`);

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
