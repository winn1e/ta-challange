import type { APIGatewayProxyResult } from 'aws-lambda';

export const buildAPIGatewayResult = (
	data: unknown,
	statusCode: number = 200
): APIGatewayProxyResult => {
	return {
		statusCode,
		body: JSON.stringify(data),
	};
};
