import { NextRequest, NextResponse } from "next/server";
import { AwsClient } from "aws4fetch";

export const dynamic = "force-dynamic";

// Type definition for the request body
interface DownloadRequest {
  fileName: string;
}

export async function POST(request: NextRequest) {
  const aws = new AwsClient({
    accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
    region: "auto",
    service: "s3",
  });

  try {
    const { fileName } = (await request.json()) as DownloadRequest;

    if (!fileName) {
      return NextResponse.json(
        { error: "fileName is required" },
        { status: 400 }
      );
    }

    // Create the URL for the R2 object
    const objectUrl = new URL(
      `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${process.env.R2_BUCKET_NAME}/${fileName}`
    );

    const signedUrl = await aws.sign(objectUrl, {
      method: "GET",
      aws: {
        signQuery: true,
      },
    });

    return NextResponse.json({
      downloadUrl: signedUrl.url.toString(),
      fileName,
      expiresIn: 3600, // 1 hour in seconds
    });
  } catch (error) {
    console.error("Error generating download pre-signed URL:", error);
    return NextResponse.json(
      { error: "Failed to generate download URL" },
      { status: 500 }
    );
  }
}
