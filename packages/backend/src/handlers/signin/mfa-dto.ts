import type { JSONSchemaType } from 'ajv';

export type MFADto = {
	loginSessionId: string;
	otp: string;
};

export const mfaDtoSchema: JSONSchemaType<MFADto> = {
	type: 'object',
	properties: {
		loginSessionId: {
			type: 'string',
			minLength: 1,
		},
		otp: {
			type: 'string',
			minLength: 6,
			maxLength: 6,
			transform: ['trim'],
		},
	},
	required: ['loginSessionId', 'otp'],
};
