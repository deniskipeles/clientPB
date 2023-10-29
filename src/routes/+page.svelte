<script>
	import { page } from '$app/stores';
	
	$: home_page = $page.data?.roots?.find((i)=>i?.name?.includes('home page')) ?? {}
	$: school = $page.data?.roots?.find((i)=>i?.name?.includes('school')) ?? {}
</script>

<svelte:head>
  <title>{school?.data?.name ?? "Prime School"}</title>
  <meta name="description" content={school?.data?.decription ?? "Prime School Online Resources"} />
</svelte:head>
<div class="pt-16 m-4">
	{@html home_page?.html_data}
</div>