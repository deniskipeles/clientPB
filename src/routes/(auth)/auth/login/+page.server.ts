import { currentUser, pb } from '$lib/pocketbase';
import { serializeNonPOJOs } from '$lib/utils';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals: { user, tables } }) {
	if (user?.id) {
		throw redirect(301, '/account');
	} else {
		const authTables = (tables?.filter(i=>i?.type == 'auth'))?.map(i=>i.name)
		return { authTables };
	}
}

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const formData = await request.formData();

		const data = {
			email: formData.get('email') as string,
			password: formData.get('password') as string,
			user_type: formData.get('user_type') as string
		};

		try {
			if (data?.user_type) {
				const authData = await pb.collection(data?.user_type).authWithPassword(data.email, data.password);
				currentUser.set(authData.record);
			}
		} catch (e: any) {
			console.log(e)
			return { incorrect: true, error: serializeNonPOJOs(e) };
		}
		throw redirect(301, '/');
	}
};

