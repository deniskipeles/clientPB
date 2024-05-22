import { listRootsRecords, pb } from '$lib/pocketbase';
import { defaultData } from '$lib/stores/app';
import { listTablesRecords, loadSchool } from '$lib/pocketbase';
import { error, type Handle } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').Handle} */
export const handle: Handle = async ({ event, resolve }) => {
	pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');
	try {
		// get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
		const collectionName = pb.authStore?.model?.collectionName;
		if (pb.authStore.isValid && collectionName) {
			await pb.collection(collectionName)?.authRefresh();
		}
		if (collectionName) {
			await pb.collection(collectionName)?.authRefresh();
		}
	} catch (_) {
		// clear the auth store on failed refresh
		pb.authStore.clear();
	}

	event.locals.pb = pb;
	event.locals.user = structuredClone(pb.authStore.model);

	try {
		// this are page builders and are necessary else it return an error page
		event.locals.tables = await listTablesRecords();
		event.locals.roots = await listRootsRecords();
		event.locals.app = (event.locals.roots.find(root=>root?.name=="app"||root?.name=="page"||root?.name=="website")) ?? defaultData;
	} catch (err) {
		error(404, { message: `${err}` });
	}

	const response = await resolve(event);
	response.headers.append(
		'set-cookie',
		event.locals.pb.authStore.exportToCookie({ httpOnly: false })
	);
	return response;
};
