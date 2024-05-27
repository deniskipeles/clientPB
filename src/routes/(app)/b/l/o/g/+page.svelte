<script>
  import { goto } from '$app/navigation';
  import {
    Card,
    Button,
    Breadcrumb,
    BreadcrumbItem
  } from 'flowbite-svelte';
  import { invalidateAll,afterNavigate } from '$app/navigation';
  
  import RecordUpsertPanel from '$lib/components/records/RecordUpsertPanel.svelte';
  import Backdrop from '$lib/components/base/Backdrop.svelte';
  import tooltip from '$lib/actions/tooltip';

  /** @type {import('./$types').PageData} */
  export let data;

  let collection = data?.tables?.find((t)=> t?.name=="blog") ?? [];
  let collectionUpsert = data?.tables?.find((t)=> t?.name=="blog") ?? [];
  let recordUpsertPanel;

  let categories = collection?.schema?.find(field => field?.name === 'category')?.options?.values ?? [];
  
  let isLoading = false;

  $: canLoadMore = data?.results?.totalItems > data?.results?.items?.length;
  let isLoadingMore = false;
  
  import { pb } from '$lib/pocketbase';
  
//$ queryString = Object.entries(data).map(([key, value]) =>key).join('-');
//const queryString1 = Object.entries(data).map(([key, value]) =>key).join('-');
onMount(()=>{
  console.log("onMount",data)
})
console.log("not mount",data)
</script>

<Breadcrumb class="pt-20 py-8">
  <BreadcrumbItem href="/" home>Home</BreadcrumbItem>
  <BreadcrumbItem>Articles</BreadcrumbItem>
</Breadcrumb>

<div>
  {#if data?.user && data?.user.roles?.includes('blogger')}
    <button type="button" class="btn btn-expanded" on:click={() => recordUpsertPanel?.show()}>
      <i class="ri-add-line" />
      <span class="txt">New record</span>
    </button>
  {/if}

  <div class="flex flex-wrap gap-2 mt-2 mb-2">
      <Button pill type="button" href="/blog" on:click={() => isLoading=true}>All</Button>
      {#each categories ?? [] as category}
        <Button
          pill
          type="button"
          on:click={() => {
            isLoading = true;
            goto(`/blog?category=${encodeURIComponent(category)}`, { replaceState: true });
          }}
        >
          {category}
        </Button>
      {/each}
    </div>

  <div class="grid relative md:grid-cols-3 gap-6">
    {#each data?.results?.items ?? [] as article (article?.id)}
      <Card>
        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {article?.title}
        </h5>
        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
          {article?.content}
        </p>
        <div class="flex text-center">
        <Button href={`/blog/${article?.id}`} class="w-fit">
          Read more
        </Button>
          {#if article?.by?.includes(data?.user?.id)}
							&nbsp;
							<button
								type="button"
								class="btn btn-sm btn-circle btn-transparent btn-hint m-l-auto"
								use:tooltip={'Edit this article'}
								on:keydown|stopPropagation
								on:click|stopPropagation={() => {
									recordUpsertPanel?.show(article.id)
								}}
							>
								<i class="ri-pencil-line" />
							</button>
						{/if}
        </div>
      </Card>
    {/each}
  </div>
</div>

{data?.results}



