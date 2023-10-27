<!-- DisplayArray.svelte -->
<script lang="ts">
	import { page } from '$app/stores';
	import { CrossIcon, TickIcon } from '$lib/icons';
	import { dateTimeFormatter, getPbImageUrl, printFxn } from '$lib/utils';
	import { Avatar, Popover, Spinner, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
	import type { RecordModel } from 'pocketbase';
	import { writable } from 'svelte/store';
	import JsonPreview from './JsonPreview.svelte';
	import { pb } from '$lib/pocketbase';
	import { CloudArrowDown, InformationCircle, PencilSquare } from 'svelte-heros-v2';
	import { afterNavigate } from '$app/navigation';

	export let record: RecordModel;
	export let isOpen: Boolean = false;
	export let onClose: Function = () => {};

	$: schema = $page.data?.tables?.find((i: any) => i?.name == $page.params?.slug)?.schema ?? [];
	$: item = record;
	$: refetch = false;
	const textContent = writable(
		`${$page.params?.slug
			?.replace($page.data?.user?.collectionName, '')
			.split('_')
			.join(' ')} Record`
	);
	$: refetching = false;
	async function refetchFxn() {
		refetching = true;
		const newRecord = await pb.collection(item?.collectionId).getOne(item?.id, {});
		record = {
			...record,
			...newRecord
		};
		refetching = false;
		refetch = true;
	}
	$: contenteditable = false;
	afterNavigate(() => {
		if (
			!$textContent
				.toLowerCase()
				?.includes(
					$page.params?.slug?.replace($page.data?.user?.collectionName, '').split('_').join(' ')
				)
		) {
			textContent.set(
				$page.params?.slug?.replace($page.data?.user?.collectionName, '').split('_').join(' ') +
					' Record'
			);
		}
		contenteditable = false;
	});
</script>

{#if isOpen}
	<div class="fixed inset-0 flex items-start justify-center z-50" class:visible={isOpen}>
		<div
			class="absolute custom-scrollbar overflow-auto inset-y-0 left-0 m-4 shadow-md w-full md:w-1/2 bg-gray-50 dark:bg-gray-500 dark:text-gray-300"
			class:translate-x-0={isOpen}
			class:translate-x-full={!isOpen}
		>
			<div class="m-2">
				<button class="absolute top-0 right-0 mt-2 mr-2" on:click={() => onClose()}>
					<svg
						class="h-7 w-7"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
				<div class="absolute flex top-0 left-0 gap-3 mt-2 ml-4">
					<button id="editBtn" class="flex" on:click={() => (contenteditable = !contenteditable)}>
						<PencilSquare />{contenteditable ? 'block editing' : 'edit to download'}
					</button>
					<button
						id="downloadBtn"
						class="flex"
						on:click={() => {
							printFxn('printableThisRecord');
						}}
					>
						<CloudArrowDown />{'download'}
					</button>
					<Popover class="w-auto text-sm font-light overflow-auto" triggeredBy={`#editBtn`}>
						<p>
							Click here to edit the content you are viewing now and download. Remember this edit
							cannot be applied into system data.
						</p>
					</Popover>
					<Popover class="w-auto text-sm font-light overflow-auto" triggeredBy={`#downloadBtn`}>
						<p>Click here to download pdf of the content you are viewing currently.</p>
					</Popover>
				</div>
			</div>
			<br />
			<div id="printableThisRecord" {contenteditable} class="m-4 dark:bg-gray-700">
				<div class={`custom-scrollbar overflow-x-auto`}>
					<table class="w-full border text-sm text-left">
						<thead class="text-xs uppercase">
							<tr class="w-1/3">
								<th class="text-center text-lg" colspan={2}>
									<div class="border-0 m-2">
										{$textContent}
									</div>
									<hr />
								</th>
							</tr>
							<tr>
								<th scope="col" class="px-6 py-1">name</th>

								<th scope="col1" class="px-6 py-3"> record </th>
							</tr>
						</thead>
						<tbody>
							{#each schema as schema_item}
								<tr>
									<td class="px-6 text-base w-1/3 font-semibold py-4 border-2"
										>{schema_item?.name?.split('_')?.join(' ')}</td
									>
									<td class="px-6 py-4 border-2">
										<div class="tems-center">
											{#if schema_item?.type == 'date'}
												{dateTimeFormatter(item[schema_item?.name])}
											{:else if schema_item.type == 'json' && typeof item[schema_item?.name] == 'object'}
												<div id={`json-${item?.id}`}>
													{#if schema_item?.name.includes('answers') && Array.isArray(item[schema_item?.name])}
														{#each item[schema_item?.name] as answer}
															<div class="flex">
																{#if answer?.correct}
																	<TickIcon />
																{:else}
																	<CrossIcon />
																{/if}{answer?.answer}
															</div>
														{/each}
													{:else}
														<pre>{JSON.stringify(item[schema_item?.name], null, 1)}</pre>
													{/if}
												</div>
											{:else if schema_item.type == 'relation'}
												{#if typeof item?.expand == 'object'}
													{#if Array.isArray(item.expand[schema_item?.name])}
														{#each item.expand[schema_item?.name] as array_item}
															<p>
																<JsonPreview json={array_item} />
															</p>
														{/each}
													{:else}
														<p>
															<JsonPreview json={item.expand[schema_item?.name]} />
														</p>
													{/if}
												{:else}
													{'N/A'}
												{/if}
											{:else if schema_item.type == 'file'}
												{#if schema_item?.options?.maxSelect == 1 && item[schema_item?.name]}
													<Avatar
														rounded
														src={getPbImageUrl(item, item[schema_item?.name], undefined) ?? ''}
													/>
												{:else if Array.isArray(item[schema_item?.name]) && item[schema_item?.name].length > 0}
													<div class="grid gap-2 grid-cols-4">
														{#each item[schema_item?.name] as image}
															<Avatar rounded src={getPbImageUrl(item, image, undefined) ?? ''} />
														{/each}
													</div>
												{/if}
											{:else if schema_item.type == 'editor'}
												{@html item[schema_item?.name]}<span class="text-blue-500">
													{#if refetching}
														<Spinner />
													{:else if !refetch}
														<button on:click={refetchFxn}> ...more &rarr; </button>
													{/if}
												</span>
											{:else if schema_item.type == 'text'}
												{item[schema_item?.name].slice(0, 50)}
											{:else if schema_item.type == 'bool'}
												{#if item[schema_item?.name] == true}
													<TickIcon />
												{:else}
													<CrossIcon />
												{/if}
											{:else}
												{item[schema_item?.name]}
											{/if}
										</div>
									</td>
								</tr>
							{/each}
							<TableBodyRow>
								<td class=" border-2" colspan={2}>
									<div class="relative inline-block text-left" id={`time-${record?.id}`}>
										<div class="cursor-pointer">&#128337</div>
										<hr />
									</div>
									<div
										class="w-auto text-sm font-light custom-scrollbar overflow-x-auto overflow-y-hidden"
									>
										<pre>Created: {dateTimeFormatter(record.created)}</pre>
										<pre>Updated: {dateTimeFormatter(record.updated)}</pre>
									</div>
								</td>
							</TableBodyRow>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
{/if}
