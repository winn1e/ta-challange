import type {
	APIGatewayProxyEvent,
	APIGatewayProxyEventPathParameters,
	APIGatewayProxyResult,
} from 'aws-lambda';
import { dynamoDbClient } from '../../clients/dynamodb';
import { sqsClient } from '../../clients/sqs';
import { buildAPIGatewayResult } from '../../utils/api-gw';
import { HandlerDecorator } from '../../decorators/handler.decorator';
import { SendMessageCommand } from '@aws-sdk/client-sqs';
import { DEFAULT_OWNER } from '../../constants';
import { getUserFromJwt } from '../../utils';

const SQS_BOTS_QUEUE_URL = process.env['SQS_BOTS_QUEUE_URL'];
const DB_BOTS_TABLE = process.env['DB_BOTS_TABLE'];

const rawHandler = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	const user = getUserFromJwt(event.headers['Authorization']!);
	const { id: botId } =
		event.pathParameters as APIGatewayProxyEventPathParameters;

	const { Item: bot } = await dynamoDbClient.get({
		TableName: DB_BOTS_TABLE,
		Key: {
			owner: DEFAULT_OWNER,
			id: botId,
		},
	});

	if (!bot) {
		return buildAPIGatewayResult({ message: 'Bot Not Found' }, 404);
	}

	if (bot['running']) {
		return buildAPIGatewayResult({ message: 'Bot is already running' }, 400);
	}

	const updateBotStatePromise = dynamoDbClient.update({
		TableName: DB_BOTS_TABLE,
		Key: {
			owner: DEFAULT_OWNER,
			id: botId,
		},
		UpdateExpression:
			'set running = :running, lastRunDate = :lastRunDate, lastRunBy = :lastRunBy',
		ExpressionAttributeValues: {
			':running': true,
			':lastRunDate': new Date().toISOString(),
			':lastRunBy': user ? user.id : null,
		},
		ReturnValues: 'ALL_NEW',
	});

	const sendSqsMessagePromise = sqsClient.send(
		new SendMessageCommand({
			QueueUrl: SQS_BOTS_QUEUE_URL,
			MessageBody: JSON.stringify({ owner: DEFAULT_OWNER, id: botId }),
			DelaySeconds: 60,
		})
	);

	const [updatedBotOutput] = await Promise.all([
		updateBotStatePromise,
		sendSqsMessagePromise,
	]);

	return buildAPIGatewayResult(updatedBotOutput.Attributes);
};

export const handler = HandlerDecorator(rawHandler);
