import { pb } from '$lib/pocketbase';
import { serializeNonPOJOs } from '$lib/utils';

/** @type {import('./$types').PageLoad} */
export const load = async({ params,parent, url }) =>{
  try {
    const perPage = Number(url.searchParams.get('perPage') ?? 30);
    const page = Number(url.searchParams.get('page') ?? 1);
    const category = (url.searchParams.get('category') ?? '');
    const search = (url.searchParams.get('search') ?? '');
    
    const filter = `category ~ "${category}" && title ~ "${search}"`;
    return {
      results:await pb.collection('blog')
      .getList(page, perPage, {
        filter,
        sort: '-created',
        fields: `*:excerpt(${250},${true})`
      })
    };
  } catch (error) {
    return {
      error: serializeNonPOJOs(error)
    };
  }
}

