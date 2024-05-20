import { pb } from '$lib/pocketbase';
import { serializeNonPOJOs } from '$lib/utils';

/** @type {import('./$types').PageLoad} */
export async function load({ params,parent url }) {
  let articles:any={}
  let error:any={}
  let parentData:any={}
  try {
    parentData = await parent();
    // fetch a paginated records list
    const perPage = Number(url.searchParams.get('perPage') ?? 30);
    const page = Number(url.searchParams.get('page') ?? 1);
    const category = (url.searchParams.get('category') ?? '');
    const search = (url.searchParams.get('search') ?? '');
    
    const filter = `category ~ "${category}" && title ~ "${search}"`;
    
    pb.collection('blog')
      .getList(page, perPage, {
        filter,
        sort: '-created',
        fields: `*:excerpt(${200},${true})`
      }).then(async (result) => {
        articles = result
      }).catch((err) => {
        error = err
      })
      
    return {
      ...parentData,
      articles,
      error: serializeNonPOJOs(error)
    };
  } catch (error) {
    return {
      ...parentData,
      articles,
      error: serializeNonPOJOs(error)
    };
  }
}

