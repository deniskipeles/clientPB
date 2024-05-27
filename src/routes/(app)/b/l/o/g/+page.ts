import { pb } from '$lib/pocketbase';
import { serializeNonPOJOs } from '$lib/utils';

/** @type {import('./$types').PageLoad} */
export const load = async({ params,parent, url }) =>{
  try {
    const results = await pb.collection('blog')
      .getList(1, 30, {
        filter,
        sort: '-created',
        fields: `*:excerpt(${200},${true})`
      })
      
    return {,
      results
    };
  } catch (error) {
    return {
      error: serializeNonPOJOs(error)
    };
  }
}

