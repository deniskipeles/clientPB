import { currentUser } from '$lib/pocketbase';
import { serializeNonPOJOs } from '$lib/utils';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals: { user, tables, pb } }) {
	if (user?.id) {
		throw redirect(301, '/account');
	} else {
		const authTables = tables?.filter((i) => i?.type == 'auth')?.map((i) => i.name);
		const auth2 = {}
		for (const record of authTables) {
		  const authDataResult = await pb.collection(record).listAuthMethods();
		  if(authDataResult?.authProviders){
		    auth2[record]=authDataResult
		  }
		}
		return { authTables,auth2 };
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
