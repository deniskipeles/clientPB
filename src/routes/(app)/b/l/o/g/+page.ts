import { pb } from '$lib/pocketbase';
import { serializeNonPOJOs } from '$lib/utils';

/** @type {import('./$types').PageLoad} */
export const load = async({ params,parent, url }) =>{
  try {
    return {
      results:await pb.collection('blog')
      .getList(1, 30, {
        //filter,
        sort: '-created',
        fields: `*:excerpt(${200},${true})`
      })
    };
  } catch (error) {
    return {
      error: serializeNonPOJOs(error)
    };
  }
}

