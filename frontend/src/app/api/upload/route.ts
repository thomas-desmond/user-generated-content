import { NextRequest, NextResponse } from "next/server";
import { AwsClient } from "aws4fetch";

export const dynamic = "force-dynamic";

interface UploadRequest {
  fileName: string;
  fileType: string;
  fileSize?: number;
}

export async function POST(request: NextRequest) {
  const aws = new AwsClient({
    accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
    region: "auto",
    service: "s3",
  });
  
  try {
    const { fileName, fileType, fileSize } = (await request.json()) as UploadRequest;

    if (!fileName || !fileType) {
      return NextResponse.json(
        { error: "fileName and fileType are required" },
        { status: 400 }
      );
    }

    // Validate file size (8MB = 8 * 1024 * 1024 bytes)
    const maxSizeInBytes = 8 * 1024 * 1024;
    if (fileSize && fileSize > maxSizeInBytes) {
      return NextResponse.json(
        { error: `File size must be 8MB or smaller. File size: ${(fileSize / 1024 / 1024).toFixed(2)}MB` },
        { status: 400 }
      );
    }

    const objectUrl = new URL(
      `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${process.env.R2_BUCKET_NAME}/${fileName}`
    );

    const signedUrl = await aws.sign(objectUrl, {
      method: "PUT",
      headers: {
        "Content-Type": fileType,
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
    console.error("Error generating pre-signed URL:", error);
    return NextResponse.json(
      { error: "Failed to generate pre-signed URL" },
      { status: 500 }
    );
  }
}
