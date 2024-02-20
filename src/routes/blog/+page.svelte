<script>
  import {
    Card,
    Button,
    Breadcrumb,
    BreadcrumbItem
  } from 'flowbite-svelte';

  // @type {import('./$types').PageData} */
	export let data
</script>

<Breadcrumb class="pt-20 py-8">
  <BreadcrumbItem href="/" home>Home</BreadcrumbItem>
  <BreadcrumbItem>Articles</BreadcrumbItem>
</Breadcrumb>

<div>
  <div class="grid relative md:grid-cols-3 gap-6">
    {#each data?.articles?.items as article (article.id)}
    <Card>
      <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{article?.title}</h5>
      <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
        {article?.content}
      </p>
      <Button href={`/blog/${article?.id}`} class="w-fit">
        Read more
      </Button>
    </Card>
    {/each}
  </div>
</div>
