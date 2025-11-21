import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { fileName: string };
    const { fileName } = body;

    if (!fileName) {
      return NextResponse.json(
        { error: "fileName is required" },
        { status: 400 }
      );
    }

    // Get the D1 database from the environment
    const db = getCloudflareContext().env.UGC_DEMO_DB;
    if (!db) {
      return NextResponse.json(
        { error: "Database not available" },
        { status: 500 }
      );
    }

    // Check if AI analysis exists for this filename
    const result = await db.prepare(
      "SELECT aiAnalysis FROM WorkflowTracking WHERE filename = ? AND aiAnalysis IS NOT NULL"
    )
      .bind(fileName)
      .first();

    if (result && result.aiAnalysis) {
      return NextResponse.json({
        analysis: result.aiAnalysis,
        analysisComplete: true,
      });
    } else {
      return NextResponse.json({
        analysisComplete: false,
      });
    }
  } catch (error) {
    console.error("Error checking AI analysis:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
