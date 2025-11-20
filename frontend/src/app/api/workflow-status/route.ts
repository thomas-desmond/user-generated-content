import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

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

    const db = getCloudflareContext().env.UGC_DEMO_DB;
    if (!db) {
      return NextResponse.json(
        { error: "Database not available" },
        { status: 500 }
      );
    }

    // Check if workflow exists for this filename
    const result = await db.prepare(
      "SELECT instanceId FROM WorkflowTracking WHERE filename = ? AND aiAnalysis IS NULL"
    )
      .bind(fileName)
      .first();

    if (result) {
      return NextResponse.json({
        instanceId: result.instanceId,
        workflowStarted: true,
      });
    } else {
      return NextResponse.json({
        workflowStarted: false,
      });
    }
  } catch (error) {
    console.error("Error checking workflow status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
