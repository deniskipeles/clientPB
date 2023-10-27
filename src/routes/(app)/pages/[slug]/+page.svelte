<script lang="ts">
	import PageRecords from '$lib/components/records/PageRecords.svelte';
	import { activeCollection } from '$lib/stores/collections';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { beforeNavigate } from '$app/navigation';

	export let data: PageData;
	
	$: clientView = false;
	onMount(() => {
		activeCollection.set(data.table);
		clientView = true;
	});

	// beforeNavigate(()=>activeCollection.set(data.table))

	$: collectionUpsert =
		$page.data.tables.find(
			(i: any) =>
				i.name == data?.table?.name?.split('_view_')[1] ||
				i.id == data?.table?.name?.split('_view_')[1]
		) ?? {};
</script>

{#if clientView}
	<PageRecords {collectionUpsert} />
{/if}
