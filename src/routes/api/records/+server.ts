import { createRecord, updateRecord } from '$lib/pocketbase';
import { serializeNonPOJOs } from '$lib/utils';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals: { user } }) {
	const formData = await request.formData();
	const formDataToJson: any = {};

	
	try {
		if (user) {
			const user_id = user?.collectionName + '_id';
			formData.append(user_id, user?.id);
		}
        formData.forEach((value, key) => {
            formDataToJson[key] = value;
        });
        // console.log(JSON.stringify(formDataToJson));
        // return json(formDataToJson)

		let record = await updateRecord(formData);
		return json(record);
	} catch (error: any) {
		return json({ success: false, error: serializeNonPOJOs(error) });
	}
}

export async function GET() {
	return json({});
}
