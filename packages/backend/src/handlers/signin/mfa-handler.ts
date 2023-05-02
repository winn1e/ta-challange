import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import jwt from 'jsonwebtoken';
import { dynamoDbClient } from '../../clients/dynamodb';
import { buildAPIGatewayResult } from '../../utils/api-gw';
import { decodeSecret } from '../../utils';
import { MFADto, mfaDtoSchema } from './mfa-dto';
import { HandlerDecorator } from '../../decorators/handler.decorator';

const JWT_SECRET = decodeSecret(process.env['JWT_SECRET']!);
const DB_LOGIN_SESSIONS_TABLE = process.env['DB_SESSIONS_TABLE'];

const generateAuthToken = (userId: string): string => {
	return jwt.sign({ user: { id: userId } }, JWT_SECRET, { expiresIn: 3600 });
};

export const rawHandler = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	const { loginSessionId, otp } = event.body as unknown as MFADto;

	const sessions = await dynamoDbClient.query({
		TableName: DB_LOGIN_SESSIONS_TABLE,
		KeyConditionExpression: 'id = :loginSessionId',
		ExpressionAttributeValues: {
			':loginSessionId': loginSessionId,
		},
		Limit: 1,
	});

	if (!sessions.Items || sessions.Items.length === 0) {
		return buildAPIGatewayResult({ message: 'Unauthorized' }, 401);
	}

	const session = sessions.Items[0]!;

	if (session['otp'] !== otp) {
		return buildAPIGatewayResult({ message: 'Invalid OTP' }, 400);
	}

	const authToken = generateAuthToken(session['email']);

	return buildAPIGatewayResult({ token: authToken });
};

export const handler = HandlerDecorator(rawHandler, {
	eventSchema: mfaDtoSchema,
});
