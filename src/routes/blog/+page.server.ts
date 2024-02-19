import { pb } from '$lib/pocketbase';

export async function load({ params, url, parent }) {
  try {
    // const parentData = await parent();
    // fetch a paginated records list
    const perPage = Number(url.searchParams.get('perPage') ?? 30);
    const page = Number(url.searchParams.get('page') ?? 1);
    const category = Number(url.searchParams.get('category') ?? '');
    const search = Number(url.searchParams.get('search') ?? '');
    
    const filter = `category = "${category}" || title ~ "${search}"`;
    
    const result = await pb
      .collection('blog')
      .getList(page, perPage, {
        filter,
        sort: '-created',
        fields: `*:excerpt(${200},${true})`
      });

    return { result };
  } catch (error) {
    return { error };
  }
}

