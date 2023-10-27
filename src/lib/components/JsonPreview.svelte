<script lang="ts">
	import { page } from '$app/stores';
	import { getPbImageUrl } from '$lib/utils';
	import { Avatar, Popover } from 'flowbite-svelte';
	import type { RecordModel } from 'pocketbase';
	import { InformationCircle } from 'svelte-heros-v2';

	export let json: RecordModel = {
		collectionId: '',
		collectionName: '',
		created: '',
		id: '',
		updated: ''
	};
	$: displayFields =
		$page.data.tables
			.find((i: any) => i?.id == json?.collectionId)
			?.schema?.filter((i: any) => i?.presentable == true).length > 0
			? $page.data.tables
					.find((i: any) => i?.id == json?.collectionId)
					?.schema?.filter((i: any) => i?.presentable == true)
			: Array(($page.data.tables.find((i: any) => i?.id == json?.collectionId)?.schema)[0]);

	$: jsonData = json;
	$: jsonToDisplay='N/A'
	function clearSensitives() {
		const { collectionId, collectionName, created, id, updated, ...jToDisplay } = json;
		jsonToDisplay = JSON.stringify(jToDisplay, null, 2)
	}
</script>

<div class="rounded-full flex gap-1 m-1 bg-gray-400 dark:text-gray-800 p-1 font-light">
	{#if Array.isArray(jsonData) && jsonData.length > 0}
		<pre>{JSON.stringify(jsonData[0], null, 2)}</pre>
	{:else if typeof jsonData === 'object' && Object.keys(jsonData).length > 0}
		<button on:mouseenter={clearSensitives} id={`b1-${jsonData?.id}`}>
			<InformationCircle />
		</button>
		{#each displayFields ?? [] as field, index}
			{#if field?.type == 'file'}
				<Avatar
					rounded
					size="xs"
					src={getPbImageUrl(
						jsonData,
						field?.options?.maxSelect == 1
							? jsonData[field?.name]
							: Array.isArray(jsonData[field?.name]) && jsonData[field?.name]?.length > 0
							? jsonData[field?.name][0]
							: '',
						undefined
					) ?? ''}
				/>
			{:else}
				<span>
					{jsonData[field?.name]?.length > 0
						? jsonData[field?.name]
						: $page.data.tables?.find((i) => i?.id == jsonData?.collectionId)?.type == 'auth'
						? jsonData['username']
						: jsonData[field?.name] ?? 'N/A'}
				</span>
			{/if}
			{  index < displayFields.length-1 ? ',' : ''}
		{/each}
	{:else}
		<p>N/A</p>
	{/if}
</div>
{#if jsonToDisplay!='N/A'}
	 <Popover
		 class="custom-scrollbar w-64 text-sm font-light overflow-auto"
		 title={`data`}
		 triggeredBy={`#b1-${jsonData?.id}`}
	 >
		 <pre>{jsonToDisplay}</pre>
	 </Popover>
{/if}
