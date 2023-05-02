import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument, TranslateConfig } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});

const translateConfig: TranslateConfig = {
	marshallOptions: {
		removeUndefinedValues: true,
		convertClassInstanceToMap: true,
	},
};

export const dynamoDbClient = DynamoDBDocument.from(client, translateConfig);
