import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function POST(request: NextRequest) {
  try {
    const { fileName } = (await request.json()) as { fileName: string };

    console.log("fileName", fileName);
    if (!fileName) {
      return NextResponse.json(
        { error: "fileName is required" },
        { status: 400 }
      );
    }

    const workflowStatusKV = getCloudflareContext().env.WORKFLOW_STATUS;

    if (!workflowStatusKV) {
      throw new Error("WORKFLOW_STATUS KV binding not found");
    }

    // Check if workflow instance exists in KV
    const instanceId = await workflowStatusKV.get(fileName);
    console.log("instanceId", instanceId);

    if (instanceId) {
      return NextResponse.json({ instanceId });
    } else {
      // Key not found - workflow not started yet
      return NextResponse.json({ instanceId: null });
    }
  } catch (error) {
    console.error("Error checking workflow status:", error);
    return NextResponse.json(
      { error: "Failed to check workflow status" },
      { status: 500 }
    );
  }
}
