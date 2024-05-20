<script>
  import { goto } from '$app/navigation';
  import {
    Card,
    Button,
    Breadcrumb,
    BreadcrumbItem
  } from 'flowbite-svelte';
  import { invalidateAll,afterNavigate } from '$app/navigation';
  
  import { page } from '$app/stores';
  import RecordUpsertPanel from '$lib/components/records/RecordUpsertPanel.svelte';
  import Backdrop from '$lib/components/base/Backdrop.svelte';
  import tooltip from '$lib/actions/tooltip';

  /** @type {import('./$types').PageData} */
  export let data;

  let collection = $page?.data?.tables?.find((t)=> t?.name=="blog");
  let collectionUpsert = $page?.data?.tables?.find((t)=> t?.name=="blog");
  let recordUpsertPanel;

  let categories = collection?.schema?.find(field => field?.name === 'category')?.options?.values ?? [];
  
  let isLoading = false;
  $: if(data){
    isLoading = false;
  }
  $: canLoadMore = data?.articles?.totalItems > data?.articles?.items?.length;
  let isLoadingMore = false;
  
  import { pb } from '$lib/pocketbase';
  async function loadMore() {
    isLoadingMore=true
    try {
      const perPage = Number($page.url.searchParams.get('perPage') ?? data.articles.perPage ?? 30);
      const pagge = Number($page.url.searchParams.get('page') ?? (data.articles.page+1) ?? 2);
      const category = ($page.url.searchParams.get('category') ?? '');
      const search = ($page.url.searchParams.get('search') ?? '');
      
      const filter = `category ~ "${category}" && title ~ "${search}"`;
      
      const articles= await pb
        .collection('blog')
        .getList(pagge, perPage, {
          filter,
          sort: '-created',
          fields: `*:excerpt(${200},${true})`
        });
  
      data.articles.items = [...data?.articles?.items,...articles?.items]
      data.articles.page = articles?.page
      isLoadingMore=false
    } catch (error) {
      isLoadingMore=false
      console.log(error);
    }
  }
  $: if(data){
    console.log(data)
  }

</script>

<Breadcrumb class="pt-20 py-8">
  <BreadcrumbItem href="/" home>Home</BreadcrumbItem>
  <BreadcrumbItem>Articles</BreadcrumbItem>
</Breadcrumb>

<div>
  {#if $page?.data?.user && $page?.data?.user.roles?.includes('blogger')}
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
    {#each data?.articles?.items ?? [] as article (article?.id)}
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
          {#if article?.by?.includes($page.data?.user?.id)}
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
{#if data?.articles?.items.length && canLoadMore}
	<tr>
		<td colspan="99" class="txt-center">
			<button
				class="btn btn-expanded-lg btn-secondary btn-horizontal-sticky"
				disabled={isLoadingMore}
				class:btn-loading={isLoadingMore}
				on:click|preventDefault={() => loadMore()}
			>
				<span class="txt">Load more</span>
			</button>
		</td>
	</tr>
{/if}



<Backdrop {isLoading}/>

<RecordUpsertPanel
  bind:this={recordUpsertPanel}
  collection={collectionUpsert}
  on:hide={() => {
    recordUpsertPanel?.hide()
  }}
  on:save={(e) => {
    invalidateAll();
  }}
  on:delete={(e) => {
    invalidateAll();
  }}
/>
