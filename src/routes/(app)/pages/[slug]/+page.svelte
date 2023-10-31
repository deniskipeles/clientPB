<script lang="ts">
	import PageRecords from '$lib/components/records/PageRecords.svelte';
	import { activeCollection } from '$lib/stores/collections';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { ErrorComp } from '$lib/components';
	import { error } from '@sveltejs/kit';

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

{#if data.error}
	<ErrorComp error={data.error} />
{/if}
{#if clientView}
	<PageRecords collection={data.table} {collectionUpsert} />
{/if}
