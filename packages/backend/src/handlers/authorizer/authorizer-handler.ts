import type {
	APIGatewayTokenAuthorizerHandler,
	APIGatewayTokenAuthorizerEvent,
	PolicyDocument,
	Callback,
	APIGatewayAuthorizerResult,
	Context,
} from 'aws-lambda';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { decodeSecret } from '../../utils';

const JWT_SECRET = decodeSecret(process.env['JWT_SECRET']!);

const generatePolicyDocument = (effect: 'Allow' | 'Deny'): PolicyDocument => {
	return {
		Version: '2012-10-17',
		Statement: [
			{
				Action: 'execute-api:Invoke',
				Effect: effect,
				Resource: '*',
			},
		],
	};
};

export const handler: APIGatewayTokenAuthorizerHandler = (
	event: APIGatewayTokenAuthorizerEvent,
	_context: Context,
	callback: Callback<APIGatewayAuthorizerResult>
) => {
	const token = event.authorizationToken.replace('Bearer ', '');

	try {
		const { user } = jwt.verify(token, JWT_SECRET) as JwtPayload;
		callback(null, {
			principalId: user.id,
			policyDocument: generatePolicyDocument('Allow'),
		});
	} catch (error) {
		console.log(error);
		callback('Unauthorized');
	}
};
