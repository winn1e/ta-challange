import middy from '@middy/core';
import httpCors from '@middy/http-cors';
import jsonBodyParser from '@middy/http-json-body-parser';
import validator from '@middy/validator';
import { transpileSchema } from '@middy/validator/transpile';
import errorLogger from '@middy/error-logger';
import httpErrorHandler from '@middy/http-error-handler';
import type { Handler } from 'aws-lambda';
import { EventSchemaDecorator } from './event-schema.decorator';

type Options = {
	eventSchema?: any;
};

export const HandlerDecorator = (handler: Handler, options: Options = {}) => {
	const { eventSchema } = options;

	const decorated = middy(handler)
		.use(jsonBodyParser())
		.use(httpCors())
		.use(errorLogger())
		.use(httpErrorHandler());

	if (eventSchema) {
		decorated.use(
			validator({
				eventSchema: transpileSchema(EventSchemaDecorator(eventSchema)),
			})
		);
	}

	return decorated;
};
