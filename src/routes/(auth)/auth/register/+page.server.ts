import { currentUser } from '$lib/pocketbase';
import { serializeNonPOJOs } from '$lib/utils';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals: { user, tables } }) {
	if (user?.id) {
		throw redirect(301, '/account');
	} else {
		const authTables = tables?.filter((i) => i?.type == 'auth')?.map((i) => i.name);
		return { authTables };
	}
}

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const formData = await request.formData();

		const data = {
			user_type: formData.get('user_type') as string,
			email: formData.get('email') as string,
			password: formData.get('password') as string,
			passwordConfirm: formData.get('passwordConfirm') as string
		};

		try {
			await locals.pb.collection(data.user_type).create(data);
			await locals.pb.collection(data.user_type).requestVerification(data?.email);
			let res = await locals.pb
				.collection(data.user_type)
				.authWithPassword(data.email, data.password);
			currentUser.set(res.record);
		} catch (e: any) {
			console.error(e);
			return { incorrect: true, error: serializeNonPOJOs(e) };
		}
		throw redirect(301, '/');
	}
};
