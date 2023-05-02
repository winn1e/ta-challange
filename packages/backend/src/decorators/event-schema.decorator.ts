import type { JSONSchemaType } from 'ajv';

export const EventSchemaDecorator = <T>(schema: JSONSchemaType<T>) => {
	return {
		type: 'object',
		properties: {
			body: {
				...schema,
			},
		},
		required: ['body'],
	};
};
