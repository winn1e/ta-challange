import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { SendEmailCommand, MessageRejected } from '@aws-sdk/client-ses';
import { dynamoDbClient } from '../../clients/dynamodb';
import { sesClient } from '../../clients/ses';
import { generateOtp, generateSessionId } from '../../utils';
import { buildAPIGatewayResult } from '../../utils/api-gw';
import { HandlerDecorator } from '../../decorators/handler.decorator';
import { SignInDto, signInDtoSchema } from './signin-dto';

const SOURCE_EMAIL = process.env['SES_SENDER'];
const DB_LOGIN_SESSIONS_TABLE = process.env['DB_SESSIONS_TABLE'];

const rawHandler = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	const { email } = event.body as unknown as SignInDto;
	const sessionId = generateSessionId();
	const otp = generateOtp();

	await dynamoDbClient.put({
		TableName: DB_LOGIN_SESSIONS_TABLE,
		Item: { id: sessionId, otp, email },
	});

	try {
		await sesClient.send(
			new SendEmailCommand({
				Destination: {
					ToAddresses: [email],
				},
				Message: {
					Subject: { Data: 'One Time Passowd' },
					Body: { Text: { Data: otp } },
				},
				Source: SOURCE_EMAIL,
			})
		);
	} catch (error) {
		if (error instanceof MessageRejected) {
			return buildAPIGatewayResult({ message: 'Unauthorized' }, 401);
		}

		throw error;
	}

	return buildAPIGatewayResult({ sessionId }, 201);
};

export const handler = HandlerDecorator(rawHandler, {
	eventSchema: signInDtoSchema,
});
