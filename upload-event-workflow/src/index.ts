// <docs-tag name="full-workflow-example">
import { WorkflowEntrypoint, WorkflowStep, WorkflowEvent } from 'cloudflare:workers';

type Env = {
	MY_WORKFLOW: Workflow;
	R2_BUCKET: R2Bucket;
	AI: Ai;
	UGC_DEMO_DB: D1Database;
};

// User-defined params passed to your workflow
type Params = {
	fileKey: string;
};

// <docs-tag name="workflow-entrypoint">
export class MyWorkflow extends WorkflowEntrypoint<Env, Params> {
	async run(event: WorkflowEvent<Params>, step: WorkflowStep) {
		const fileKey = event.payload.fileKey;

		await step.do('Add instance ID to Database', async () => {
			// Check if filename already exists
			const existingRecord = await this.env.UGC_DEMO_DB.prepare(
				`SELECT id FROM WorkflowTracking WHERE filename = ?`
			)
				.bind(fileKey)
				.first();

			if (existingRecord) {
				// Update existing record with new instance ID and blank out aiAnalysis
				await this.env.UGC_DEMO_DB.prepare(
					`UPDATE WorkflowTracking
					 SET instanceId = ?, aiAnalysis = NULL
					 WHERE filename = ?`
				)
					.bind(event.instanceId, fileKey)
					.run();
			} else {
				// Insert new record
				await this.env.UGC_DEMO_DB.prepare(
					`INSERT INTO WorkflowTracking (filename, instanceId, aiAnalysis)
					 VALUES (?, ?, ?)`
				)
					.bind(fileKey, event.instanceId, null)
					.run();
			}
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

		await step.do('Store AI analysis results in DB', async () => {
			await this.env.UGC_DEMO_DB.prepare(
				`
				UPDATE WorkflowTracking
				SET aiAnalysis = ?
				WHERE filename = ?
			`
			)
				.bind(AiImageToTextAnalysis, fileKey)
				.run();
		});
	}
}

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

export default {
	async fetch(req: Request, env: Env): Promise<Response> {
		return Response.json({ status: 'Not implemented' });
	},

	// Queue consumer handler for R2 upload events
	async queue(batch: MessageBatch<any>, env: Env): Promise<void> {
		return handleQueueMessage(batch, env);
	},
};

