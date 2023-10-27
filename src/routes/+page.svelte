<script>
	import { page } from '$app/stores';
	
	$: home_page = $page.data?.roots?.find((i)=>i?.name?.includes('home page')) ?? {}
</script>

<div class="pt-16 m-4">
	{@html home_page?.html_data}
</div>