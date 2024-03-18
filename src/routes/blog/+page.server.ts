import { pb as PB } from '$lib/pocketbase';

export async function load({ params, url, locals:{pb} }) {
  try {
    // const parentData = await parent();
    // fetch a paginated records list
    const perPage = Number(url.searchParams.get('perPage') ?? 30);
    const page = Number(url.searchParams.get('page') ?? 1);
    const category = (url.searchParams.get('category') ?? '');
    const search = (url.searchParams.get('search') ?? '');
    
    const filter = `category ~ "${category}" || title ~ "${search}"`;
    
    const articles= await pb
      .collection('blog')
      .getList(page, perPage, {
        filter,
        sort: '-created',
        fields: `*:excerpt(${200},${true})`
      });

    return { articles };
  } catch (error) {
    return { error };
  }
}

