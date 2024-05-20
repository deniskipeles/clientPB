import {
  pb
} from '$lib/pocketbase';

/** @type {import('./$types').PageLoad} */
export async function load({
  params
}) {
  try {
    const article = await pb.collection('blog').getOne(params.article, {
      expand: 'by'
    });

    return {
      article
    };
  } catch (error) {
    return {
      error
    };
  }
}
