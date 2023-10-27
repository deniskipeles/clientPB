<script lang="ts">
	import { page } from '$app/stores';
	import { pb } from '$lib/pocketbase';
	import { Button, CloseButton, Drawer, Li, List, Modal, Popover, Search } from 'flowbite-svelte';
	import type { ListResult, RecordModel } from 'pocketbase';
	import { sineIn } from 'svelte/easing';
	import JsonPreview from './JsonPreview.svelte';
	import { CheckCircle, PencilSquare } from 'svelte-heros-v2';
	import RecordEditOrAdd from './RecordEditOrAdd.svelte';
	import FloatingDynamicForm from './FloatingDynamicForm.svelte';
	import { stackForms } from '$lib/stores';
	let hidden1 = true;
	let transitionParams = {
		x: -320,
		duration: 200,
		easing: sineIn
	};

	export let expandedData: RecordModel;
	export let field = {
		system: false,
		id: 'saf0gutw',
		name: 'more_photos',
		type: 'relation',
		required: false,
		presentable: false,
		unique: false,
		options: {
			collectionId: '5lefk5zohg7o6au',
			cascadeDelete: false,
			minSelect: null,
			maxSelect: null,
			displayFields: null
		}
	};
	$: presentableFields =
		$page.data.tables
			.find(
				(i: any) => i?.name == field?.options?.collectionId || i?.id == field?.options?.collectionId
			)
			?.schema?.filter((i: any) => i?.presentable)
			?.map((i: any) => i?.name) ?? [];
	$: table = $page.data.tables.find(
		(i: any) => i?.name == field?.options?.collectionId || i?.id == field?.options?.collectionId
	);

	let relation_items: ListResult<RecordModel>;
	let fetching_items = false;
	async function openDrawer() {
		isOpen = true;
		fetching_items = true;
		// fetch a paginated records list
		try {
			relation_items = await pb.collection(table?.id).getList(1, 50, {
				sort: '-created'
			});
		} catch (error) {
			relation_items = {
				page: 0,
				perPage: 30,
				totalPages: 0,
				totalItems: 0,
				items: []
			};
		}
		fetching_items = false;
	}
	let isOpen = false;
	let openForm = false;

	const onOpen = (id: string) => {
		stackForms.update((val) => {
			val = [...val, id];
			return val;
		});
	};
</script>

{#if expandedData?.id && typeof expandedData == 'object'}
	<p>
		{#if table?.type == 'auth'}
			{expandedData?.name ?? expandedData?.username}
		{:else}
			{#each presentableFields as field}
				&nbsp;{expandedData[field]}
			{/each}
		{/if}
	</p>
{:else}
	<p>N/A</p>
{/if}
{#if !table?.name?.includes('personnel')}
	<Button  on:click={openDrawer} type="button" class="w-full" pill>pick your targeted record</Button>
{/if}




{#if isOpen}
	<div class="fixed inset-0 flex items-start justify-center z-auto">
		<FloatingDynamicForm
			dataReceivedByForm={expandedData}
			collectionFormNumber={table?.id}
			collectionId={table?.id}
			full={true}
		/>
		<div
			class="absolute custom-scrollbar overflow-auto inset-y-0 self-center m-4 shadow-md w-full bg-gray-50 dark:bg-gray-500 dark:text-gray-300"
			class:translate-x-0={isOpen}
			class:translate-x-full={!isOpen}
		>
			<div class="m-2">
				<button
					type="button"
					class="absolute top-0 right-0 mt-2 mr-2"
					on:click={() => {
						isOpen = false;
						
					}}
				>
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
				<div class="absolute flex top-0 left-0 gap-1 m-2">
					<button type="button" id="editBtn" class="flex" on:click={() => onOpen(table?.id)}>
						<PencilSquare />New Record
					</button>

					<Popover class="w-auto text-sm font-light overflow-auto" triggeredBy={`#editBtn`}>
						<p>
							Click here to edit the content you are viewing now and download. Remember this edit
							cannot be applied into system data.
						</p>
					</Popover>
				</div>
				<br />
				<div>
					<form method="post">
						<div class="flex rounded-full border-2">
							<Search
								class="rounded-full"
								value=''
								name="filter"
							/>
							<Button pill type="submit">search</Button>
						</div>
					</form>
				</div>
			</div>
			{JSON.stringify($stackForms)}
			<br />
			<div class="m-2 dark:bg-gray-700">
				<div class={`overflow-x-auto custom-scrollbar`}>
					<table class="w-full text-sm text-left">
						<thead class="text-xs uppercase">
							<tr class="w-1/3">
								<th class="text-center text-lg" colspan={1}>
									<div class="border-0">
										{table?.name ?? 'Data'} Records
									</div>
									<hr />
								</th>
							</tr>
							<tr>
								<th scope="col" class="px-6 py-3"> record list </th>
							</tr>
						</thead>
						<tbody>
							{#each relation_items?.items ?? [] as relation_item}
								<tr>
									<td class="px-2 py-2 border-2 rounded-full flex">
										<button class="mr-2" type="button"><CheckCircle /></button><JsonPreview
											json={relation_item}
										/>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
{/if}
