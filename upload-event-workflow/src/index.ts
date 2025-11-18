// <docs-tag name="full-workflow-example">
import { WorkflowEntrypoint, WorkflowStep, WorkflowEvent } from 'cloudflare:workers';

type Env = {
	MY_WORKFLOW: Workflow;
	R2_BUCKET: R2Bucket;
	AI: Ai;
	AI_ANALYSIS_KV: KVNamespace;
	WORKFLOW_STATUS: KVNamespace;
};

// User-defined params passed to your workflow
type Params = {
	fileKey: string;
};

// <docs-tag name="workflow-entrypoint">
export class MyWorkflow extends WorkflowEntrypoint<Env, Params> {
	async run(event: WorkflowEvent<Params>, step: WorkflowStep) {
		const fileKey = event.payload.fileKey;

		await step.do('Update workflow status with instanceId', async () => {
			await this.env.WORKFLOW_STATUS.put(fileKey, event.instanceId);
		});

		const fileAsArrayBuffer = await step.do('Get file from R2', async () => {
			const file = await this.env.R2_BUCKET.get(fileKey);
			if (!file) {
				throw new Error(`File not found: ${fileKey}`);
			}
			return file.arrayBuffer();
		});

		const AiImageToTextAnalysis = await step.do('Analyze image with AI', async () => {
			const input = {
				image: [...new Uint8Array(fileAsArrayBuffer)],
				prompt: 'Provide a description of this image',
				max_tokens: 512,
			};
			const response = await this.env.AI.run('@cf/llava-hf/llava-1.5-7b-hf', input);
			console.log(response.description);
			return response.description;
		});

		await step.do('Store AI analysis in KV', async () => {
			await this.env.AI_ANALYSIS_KV.put(fileKey, AiImageToTextAnalysis);
		});
	}
}
// </docs-tag name="workflow-entrypoint">

// Queue consumer to handle R2 upload events
async function handleQueueMessage(batch: MessageBatch<any>, env: Env): Promise<void> {
	console.log('=== QUEUE MESSAGE BATCH RECEIVED ===');
	console.log('Batch size:', batch.messages.length);
	console.log('Queue name:', batch.queue);

	for (const message of batch.messages) {
		try {
			// Trigger the workflow with the queue message data
			console.log('=== TRIGGERING WORKFLOW ===');
			const instance = await env.MY_WORKFLOW.create({
				params: {
					fileKey: message.body.object.key,
				},
			});

			message.ack(); // Acknowledge successful processing
		} catch (error) {
			console.error('Error processing queue message:', error);
			console.error('Error details:', JSON.stringify(error, null, 2));
			// Don't ack the message so it will be retried
		}

		console.log('=== QUEUE MESSAGE PROCESSING COMPLETE ===');
	}
}

// <docs-tag name="workflows-fetch-handler">
export default {
	async fetch(req: Request, env: Env): Promise<Response> {
		let url = new URL(req.url);

		if (url.pathname.startsWith('/favicon')) {
			return Response.json({}, { status: 404 });
		}

		// Get the status of an existing instance, if provided
		// GET /?instanceId=<id here>
		let fileKey = url.searchParams.get('fileKey');
		if (fileKey) {
			const instanceId = await env.WORKFLOW_STATUS.get(fileKey);
			if (!instanceId) {
				return Response.json({ status: 'No instance id found' });
			}

			let instance = await env.MY_WORKFLOW.get(instanceId);
			return Response.json({
				status: await instance.status(),
			});
		}

		return Response.json({ status: 'No file key provided' });
	},

	// Queue consumer handler for R2 upload events
	async queue(batch: MessageBatch<any>, env: Env): Promise<void> {
		return handleQueueMessage(batch, env);
	},
};
// </docs-tag name="workflows-fetch-handler">
// </docs-tag name="full-workflow-example">
