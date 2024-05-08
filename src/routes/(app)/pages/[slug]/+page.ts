import { pb } from '$lib/pocketbase';
import { activeCollection } from '$lib/stores/collections';
import { serializeNonPOJOs } from '$lib/utils';

/** @type {import('./$types').PageLoad} */
export async function load({ params, url, parent }) {
	let table = {};
	try {
		const parentData = await parent();
		table = parentData.tables.find((i: any) => i?.name == params.slug || i?.id == params.slug);
		activeCollection.set(table)
		// fetch a paginated records list
		const perPage = Number(url.searchParams.get('perPage') ?? 30);
		const page = Number(url.searchParams.get('page') ?? 1);
		const sort = url.searchParams.get('sort') ?? '';
		let filter = url.searchParams.get('filter') ?? '';

		// const expand = table?.schema
		// 	.filter((i) => i.type == 'relation')
		// 	?.map((i) => i?.name)
		// 	?.join(',');
		// const excerpt = table.schema
		// 	.filter((i) => i.type == 'editor')
		// 	?.map((i) => `${i?.name}:excerpt(30)`)
		// 	?.join(',');

		// filter = table.schema?.map((i) => `${i?.name} ~ "${filter?.replaceAll('"','')}"`)?.join('||');
		
		// const fields = excerpt.length > 0 ? `*,${excerpt}` : '*';

		// const resultList = await pb.collection(params.slug).getList(page, perPage, {
		// 	sort,
		// 	expand,
		// 	fields,
		// 	filter
		// });
		return { table };
	} catch (error) {
		// console.log(error);
		return { error: serializeNonPOJOs(error),table };
	}
}


