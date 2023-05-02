import type {
	SQSBatchItemFailure,
	SQSBatchResponse,
	SQSEvent,
	SQSRecord,
} from 'aws-lambda';
import { dynamoDbClient } from '../../clients/dynamodb';
import type { UpdateCommandOutput } from '@aws-sdk/lib-dynamodb';

const DB_BOTS_TABLE = process.env['DB_BOTS_TABLE'];

const processRecord = async (
	record: SQSRecord
): Promise<UpdateCommandOutput> => {
	const { owner, id } = JSON.parse(record.body);
	return dynamoDbClient.update({
		TableName: DB_BOTS_TABLE,
		Key: { id, owner },
		UpdateExpression: 'set running = :running',
		ExpressionAttributeValues: {
			':running': false,
		},
	});
};

export const handler = async (event: SQSEvent): Promise<SQSBatchResponse> => {
	const updateBotStatePromises = event.Records.map((record) =>
		processRecord(record)
	);

	const botStateUpdates = await Promise.allSettled(updateBotStatePromises);

	const batchItemFailures = botStateUpdates.reduce<SQSBatchItemFailure[]>(
		(failures, result, idx) => {
			if (result.status === 'rejected') {
				console.log(result.reason);
				failures.push({ itemIdentifier: event.Records[idx]!.messageId });
			}

			return failures;
		},
		[]
	);

	return { batchItemFailures };
};
