// import { Honeypot, SpamError } from "remix-utils/honeypot/";

class SpamError extends Error {}

export const honeypot = {
	getInputProps: async () => ({}),
	check: (formData: FormData) => {},
};

// = new Honeypot({
// 	validFromFieldName: process.env.NODE_ENV === "test" ? null : undefined,
// 	encryptionSeed: process.env.HONEYPOT_SECRET,
// });

export function checkHoneypot(formData: FormData) {
	try {
		honeypot.check(formData);
	} catch (error) {
		if (error instanceof SpamError) {
			throw new Response(
				JSON.stringify("Unexpected error. Please try again."),
				{ status: 422 },
			);
		}
		throw error;
	}
}
