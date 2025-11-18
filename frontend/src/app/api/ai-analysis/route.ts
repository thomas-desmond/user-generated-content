import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function POST(request: NextRequest) {
  try {
    const { fileName } = (await request.json()) as { fileName: string };

    if (!fileName) {
      return NextResponse.json(
        { error: "fileName is required" },
        { status: 400 }
      );
    }

    // Get Cloudflare context and access AI_ANALYSIS_KV binding
    const { env } = getCloudflareContext();
    const aiAnalysisKV = env.AI_ANALYSIS_KV;

    if (!aiAnalysisKV) {
      throw new Error("AI_ANALYSIS_KV binding not found");
    }

    // Check if AI analysis results exist in KV
    const analysis = await aiAnalysisKV.get(fileName);

    if (analysis) {
      return NextResponse.json({ analysis });
    } else {
      // Key not found - AI analysis not complete yet
      return NextResponse.json({ analysis: null });
    }
  } catch (error) {
    console.error("Error checking AI analysis:", error);
    return NextResponse.json(
      { error: "Failed to check AI analysis" },
      { status: 500 }
    );
  }
}
