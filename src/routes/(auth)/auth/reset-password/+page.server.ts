import { serializeNonPOJOs } from '$lib/utils';
import type { Actions } from './$types';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals: { tables } }) {
	const authTables = tables?.filter((i) => i?.type == 'auth')?.map((i) => i.name);
	return { authTables };
}

export const actions: Actions = {
	default: async ({ locals: { user, pb }, request }) => {
		const formData = await request.formData();

		const email = formData.get('email') as string;
		const user_type = formData.get('user_type') as string;

		try {
				const res = await pb.collection(user_type).requestPasswordReset(email);
			if (res) {
        return { success: true, msg: 'Token to reset your password has been sent to your email.' };
      }
      return { success: false, msg: 'Token to reset your password was not sent.' };
		} catch (e: any) {
			return { success: false, error: serializeNonPOJOs(e) };
		}
	}
};
