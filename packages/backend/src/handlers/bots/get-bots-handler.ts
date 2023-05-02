import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { dynamoDbClient } from '../../clients/dynamodb';
import { buildAPIGatewayResult } from '../../utils/api-gw';
import { HandlerDecorator } from '../../decorators/handler.decorator';
import { DEFAULT_OWNER } from '../../constants';

const DB_BOTS_TABLE = process.env['DB_BOTS_TABLE'];

const rawHandler = async (
	_event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	const botsQueryResult = await dynamoDbClient.query({
		TableName: DB_BOTS_TABLE,
		KeyConditionExpression: '#owner = :owner',
		ExpressionAttributeValues: {
			':owner': DEFAULT_OWNER,
		},
		ExpressionAttributeNames: {
			'#owner': 'owner'
		}
	});
	const bots = botsQueryResult.Items || [];

	return buildAPIGatewayResult(bots);
};

export const handler = HandlerDecorator(rawHandler);