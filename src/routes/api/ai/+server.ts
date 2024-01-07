import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import { serializeNonPOJOs } from '$lib/utils';
import { json } from '@sveltejs/kit';

type InputPrompt = {
	prompt: string;
	key: string | null;
	url: string;
	type: string;
	info: unknown;
};

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals: { user, school }, url }) {
	const formDataToJson = (await request.json()) ?? {};

	if (!user) {
		return json({ success: false, error: new Error('Login to use ai.') });
	}
	try {
		const prompt = await getPrompt(formDataToJson);
		const input = {
			prompt,
			key: school?.ai_key ?? 'key',
			url: url.hostname,
			server_url: PUBLIC_POCKETBASE_URL,
			type: 'school',
			request_id: formDataToJson?.request_id ?? url.hostname,
			info: school
		};

		const headers = {
			'Content-Type': 'application/json'
		};

		const response = await fetch('https://www.ktechs.xyz/api/ai', {
			method: 'PUT',
			headers: headers,
			body: JSON.stringify(input)
		}).then((response) => response.json());
		
		return json(response);
	} catch (error: any) {
		return json({ success: false, error: serializeNonPOJOs(error) });
	}
}

export async function GET() {
	return json({});
}

async function getPrompt(object: Record<string, any>) {
	let prompt = '';
	for (const key in object) {
		if (Object.prototype.hasOwnProperty.call(object, key)) {
			const element = object[key];
			if (
				typeof element == 'string' &&
				(element.includes('prompt') || element.includes('question') || element.includes('query'))
			) {
				prompt += `${key}: ${element}.\n`;
			}
		}
	}
	if (prompt.length == 0) throw new Error('Please Enter the content to prompt ai.');

	return prompt;
}
