import { randomBytes } from 'crypto';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const generateSessionId = (): string => {
	return randomBytes(32).toString('base64');
};

export const generateOtp = (length: number = 6): string => {
	const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
	const otp: number[] = [];

	for (let idx = 0; idx < length; idx++) {
		otp[idx] = numbers[Math.floor(Math.random() * numbers.length)] as number;
	}

	return otp.join('');
};

export const decodeSecret = (secret: string): string => {
	return Buffer.from(secret, 'base64').toString();
};

export const getUserFromJwt = (token: string): { id: string } | null => {
	try {
		const { user } = jwt.decode(token.replace('Bearer ', '')) as JwtPayload;
		return user;
	} catch (error) {
		return null;
	}
};
