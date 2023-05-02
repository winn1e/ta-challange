import { generateOtp, generateSessionId, getUserFromJwt } from '../';

describe('utils', () => {
	describe(generateOtp, () => {
		it('should return 6 symbols OTP', () => {
			const otp = generateOtp();

			expect(typeof otp === 'string').toBeTruthy();
			expect(otp.length).toBe(6);
		});
	});

	describe(generateSessionId, () => {
		it('should return random non-empty string', () => {
			const result = generateSessionId();

			expect(result).toEqual(expect.any(String));
			expect(result.length).toBeGreaterThan(0);
		});
	});

	describe(getUserFromJwt, () => {
		it('should return User object', () => {
			const validToken =
				'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoidXNlckBleGFtcGxlLmNvbSJ9LCJpYXQiOjE2ODMwMzI4MzAsImV4cCI6MTY4MzAzNjQzMH0.sy6FhJ-x8QkETpP06XXDmOgGaMVX-oaeDjfW3TEBDH8';

			const result = getUserFromJwt(validToken);

			expect(result).toEqual({
				id: 'user@example.com',
			});
		});

		it('should return null', () => {
			const invalidToken = 'invalid.jwt.value';

			const result = getUserFromJwt(invalidToken);

			expect(result).toBeNull();
		});
	});
});
