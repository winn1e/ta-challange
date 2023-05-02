import type { JSONSchemaType } from 'ajv';

export type SignInDto = {
	email: string;
};

export const signInDtoSchema: JSONSchemaType<SignInDto> = {
	type: 'object',
	properties: {
		email: {
			type: 'string',
			format: 'email',
		},
	},
	required: ['email'],
};
