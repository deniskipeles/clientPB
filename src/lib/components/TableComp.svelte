<script lang="ts">
	export let data: any;

	import { CrossIcon, TickIcon } from '$lib/icons';
	import {
		TableBodyCell,
		Checkbox,
		Avatar,
		Popover,
		Search,
		Button,
		Spinner,
		ChevronDown,
		ChevronUp,
		Toggle
	} from 'flowbite-svelte';

	import { dateTimeFormatter, getPbImageUrl, printFxn, urlToBase64 } from '$lib/utils';
	import RecordEditOrAdd from '$lib/components/RecordEditOrAdd.svelte';
	import TableRowCustom from '$lib/components/TableRowCustom.svelte';
	import JsonPreview from '$lib/components/JsonPreview.svelte';
	import { ErrorComp } from '$lib/components';
	import {
		ArrowPath,
		Bars4,
		ChevronUpDown,
		CloudArrowDown,
		PencilSquare,
		Printer
	} from 'svelte-heros-v2';
	import { page } from '$app/stores';
	import { afterNavigate, beforeNavigate, invalidateAll } from '$app/navigation';
	import { writable } from 'svelte/store';
	import ViewRecord from '$lib/components/ViewRecord.svelte';
	import type { RecordModel } from 'pocketbase';
	import { onMount } from 'svelte';

	let isOpen = false;
	let isView = false;
	let record: RecordModel = {
		collectionId: '',
		collectionName: '',
		created: '',
		id: '',
		updated: ''
	};

	let fetching = true;
	$: {
		if (data.resultList) {
			fetching = false;
			refetching = false;
		}
	}
	beforeNavigate(() => {
		fetching = true;
	});
	afterNavigate(() => {
		if (data.resultList) {
			fetching = false;
		}
		if (
			!$textContent
				.toLowerCase()
				?.includes(
					$page.params?.slug?.replace($page.data?.user?.collectionName, '').split('_').join(' ')
				)
		) {
			textContent.set(
				$page.params?.slug?.replace($page.data?.user?.collectionName, '').split('_').join(' ')
			);
		}
	});
	$: refetching = false;
	const textContent = writable(
		$page.params?.slug?.replace($page.data?.user?.collectionName, '').split('_').join(' ')
	);
	let fieldsToView: string[] = [];
	afterNavigate(() => {
		getLocal();
		contenteditable = false;
	});

	function getLocal() {
		const fs = localStorage.getItem($page.params?.slug) ?? JSON.stringify([]);
		fieldsToView = JSON.parse(fs);
		schema = data?.table?.schema?.filter((i) => !fieldsToView.includes(i?.id));
	}

	const onChange = (e: Event, field: any) => {
		let fields: string;
		const slug = $page.params?.slug;
		if (e.target instanceof HTMLInputElement && e.target instanceof HTMLElement) {
			// console.log(fieldsToView, field?.id);
			if (e?.target?.checked) {
				fields = JSON.stringify([...fieldsToView, field?.id]);
				localStorage.setItem(slug, fields);
				getLocal();
			} else {
				fields = JSON.stringify(fieldsToView.filter((i) => i !== field?.id));
				localStorage.setItem(slug, fields);
				getLocal();
			}
		}
	};

	$: schema = data?.table?.schema;
	$: contenteditable = false;

	let printingPDF = false;

	import jsPDF from 'jspdf';
	import autoTable from 'jspdf-autotable';
	import RecordPreviewPanel from '$lib/components/records/RecordPreviewPanel.svelte';
	import RecordUpsertPanel from '$lib/components/records/RecordUpsertPanel.svelte';
	import { split } from 'postcss/lib/list';

	$: loadingPDF = false;
	// $: images = []
	let imagesType: {
		row: number;
		col: number;
		base64: string | null;
	}[] = [];
	$: images = imagesType;
	onMount(() => {
		getLocal();
		getBase64();
	});
	afterNavigate(() => {
		images = [];
		getBase64();
	});
	const getBase64 = () => {
		data.resultList?.items.forEach((item, row) => {
			schema?.forEach((schema_item, col) => {
				if (schema_item.type == 'file') {
					urlToBase64(
						getPbImageUrl(
							item,
							schema_item?.options?.maxSelect == 1
								? item[schema_item?.name]
								: Array.isArray(item[schema_item?.name]) && item[schema_item?.name].length > 0
								? item[schema_item?.name][0]
								: '',
							undefined
						) ?? ''
					)
						.then((base64) => {
							images = [...images, { row, col, base64 }];
						})
						.catch((e) => {
							images = [...images, { row, col, base64: null }];
						});
					setTimeout(() => {}, 200);
				}
			}) ?? [];
		}) ?? [];
	};
	function downloadFxn() {
		loadingPDF = true;
		const doc = new jsPDF();
		// It can parse html:
		// <table id="my-table"><!-- ... --></table>
		// autoTable(doc, { html: '#printable' });
		const table = schema?.map((i) => i?.name?.replaceAll('_', ' ')) ?? [];

		const tableData =
			data.resultList?.items.map((item, row) => {
				const dt =
					schema?.map((schema_item, col) => {
						if (schema_item.type == 'relation') {
							let table = data.table;
							table = $page.data.tables.find((i: any) => i.id == schema_item.options.collectionId);
							if (item.expand && item?.expand[schema_item?.name]) {
								const present = table?.schema
									.filter((i) => i.presentable == true && i.type != 'file')
									?.map((i) => i.name);
								const expand = item?.expand[schema_item?.name];
								if (Array.isArray(expand)) {
									if (table?.type == 'auth') {
										const users = expand?.map((i) =>
											i?.name?.length > 0 ? i?.name : i?.username ?? 'no name'
										);
										return users.join('\n');
									}
									let mainArr = expand.map((expanded) => {
										let arr: any = [];
										present?.forEach((field) => {
											arr.push(expanded[field]);
										});
										return arr.join(',');
									});
									return mainArr.join('\n');
								} else {
									if (table?.type == 'auth') {
										return expand?.name?.length > 0 ? expand?.name : expand?.username ?? 'no name';
									}
									let arr: any = [];
									present?.forEach((field) => {
										arr.push(expand[field]);
									});
									return arr.join(',');
								}
							}
						} else if (schema_item.type == 'file') {
						} else if (schema_item.type == 'json' && typeof item[schema_item?.name] == 'object') {
							let json = item[schema_item?.name];
							if (schema_item?.name?.includes('answers') && Array.isArray(json)) {
								const answers =
									json?.map((ans: any) => {
										if (ans?.correct) {
											return `<<CORRECT>>\n${ans.answer}`;
										}
										return `:::INCORRECT:::\n${ans.answer}`;
									}) ?? [];
								return answers.join('\n');
							} else {
								return JSON.stringify(json);
							}
						} else if (schema_item.type == 'date') {
							return dateTimeFormatter(item[schema_item?.name ?? '']);
						} else {
							return item[schema_item?.name ?? ''] ?? '';
						}
					}) ?? [];
				return dt;
			}) ?? [];
		autoTable(doc, {
			head: [table],
			body: tableData,
			didDrawCell: (data) => {
				// const answers = data.cell.text.every(elem=>elem.includes(':::INCORRECT:::')||elem.includes('<<CORRECT>>'))

				images.forEach((image) => {
					if (
						data.section === 'body' &&
						data.column.index === image.col &&
						data.row.index === image.row &&
						image.base64
					) {
						// var base64Img = 'data:image/jpeg;base64,iVBORw0KGgoAAAANS...';
						var type = image.base64.split(';')[0]?.split('/')[1]?.toUpperCase();
						// console.log(type);
						doc.addImage(image.base64, type, data.cell.x + 2, data.cell.y + 2, 10, 10);
					}
				});
			}
		});
		try {
			doc.save(`table_${Date.now()}.pdf`);
			loadingPDF = false;
		} catch (error) {
			loadingPDF = false;
		}
	}

	let allCheckedRecords: string[] = [];
	function checkedRecordsFxn(e: Event, id: string) {
		if (e.target instanceof HTMLInputElement && e.target instanceof HTMLElement) {
			if (e?.target?.checked == true && id == '__all__') {
				allCheckedRecords = [...(data.resultList?.items.map((i) => i.id) ?? []), '__all__'];
			} else if (e?.target?.checked == false && id == '__all__') {
				allCheckedRecords = [];
			} else if (e?.target?.checked == false && id !== '__all__') {
				allCheckedRecords = allCheckedRecords.filter((i) => i != id && i != '__all__');
			} else if (e?.target?.checked && id !== '__all__') {
				allCheckedRecords.push(id);
			}
		}
	}
	afterNavigate(() => (allCheckedRecords = []));
	let recordPreviewPanel:any;
	let recordUpsertPanel:any;
	$: enableOverlay = false
	onMount(()=>enableOverlay=true)
	// $: collection = data?.table
	$: collection=$page.data.tables.find((i:any) => (i.name == (data?.table?.name)?.split('_view_')[1] || i.id == (data?.table?.name)?.split('_view_')[1])) ?? {}
</script>

{#if enableOverlay}
	 <RecordPreviewPanel
		 bind:this={recordPreviewPanel}
		 collection={data?.table ?? {}}
		 on:hide={() => {
			//  updateQueryParams({ recordId: null });
		 }}
	 />
	 <RecordUpsertPanel
    bind:this={recordUpsertPanel}
    {collection}
    on:hide={() => {
        // updateQueryParams({ recordId: null });
    }}
    on:save={(e) => {
        // if (filter) {
        //     // if there is applied filter, reload the count since we
        //     // don't know after the save whether the record satisfies it
        //     recordsCount?.reload();
        // } else if (e.detail.isNew) {
        //     totalCount++;
        // }

        // recordsList?.reloadLoadedPages();
    }}
    on:delete={(e) => {
        // if (!filter || recordsList?.hasRecord(e.detail.id)) {
        //     totalCount--;
        // }

        // recordsList?.reloadLoadedPages();
    }}
/>
{/if}
<RecordEditOrAdd {record} onClose={() => (isOpen = false)} {isOpen} />
<ViewRecord {record} onClose={() => (isView = false)} isOpen={isView} />

{#if data.error}
	<ErrorComp error={data?.error} />
{:else}
	<div class="-z-50">
		<div class="flex gap-3 text-center dark:text-white">
			<button id="editBtn" class="flex" on:click={() => (contenteditable = !contenteditable)}>
				<PencilSquare />{contenteditable ? 'block editing' : 'edit to download'}
			</button>
			<button
				id="downloadBtn"
				class={`flex ${loadingPDF ? 'animate-ping' : ''}`}
				on:click={() => {
					loadingPDF = true;
					downloadFxn();
					setTimeout(() => {
						loadingPDF = false;
					}, 2000);
				}}
			>
				<CloudArrowDown />{'download'}
			</button>
			<button
				id="printBtn"
				class={`flex ${printingPDF ? 'animate-ping' : ''}`}
				on:click={() => {
					printFxn('printableThis');
				}}
			>
				<Printer />{'print'}
			</button>

			{#if refetching}
				<!-- <Spinner /> -->
				<button disabled={true}>
					<ArrowPath class="animate-spin" />
				</button>
			{:else}
				<button
					on:click={() => {
						refetching = true;
						fetching = true;
						invalidateAll();
					}}
					type="button"
				>
					<ArrowPath />
				</button>
			{/if}
		</div>

		<div class="m-4">
			<form method="get">
				<div class="flex rounded-full border-2">
					<Search
						class="rounded-full"
						value={$page.url.searchParams.get('filter') || ''}
						name="filter"
					/>
					{#if $page.url.searchParams.get('sort')}
						<input type="hidden" value={$page.url.searchParams.get('sort')} name="sort" />
					{/if}
					<Button pill type="submit">search</Button>
				</div>
			</form>
		</div>

		<Popover class="w-auto text-sm font-light" triggeredBy={`#editBtn`}>
			<p>
				Click here to edit the content you are viewing now and download. Remember this edit cannot
				be applied into system data.
			</p>
		</Popover>
		<Popover class="w-auto text-sm font-light" triggeredBy={`#downloadBtn`}>
			<p>Click here to download pdf of the content you are viewing currently.</p>
		</Popover>
		<Popover class="w-auto text-sm font-light" triggeredBy={`#printBtn`}>
			<p>Click here to download or print what you see in this table in pdf format.</p>
		</Popover>

		<div id="printableThis" {contenteditable} class={`overflow-x-auto custom-scrollbar`}>
			<table class="w-auto text-sm text-left text-gray-500 dark:text-gray-400">
				<thead
					class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
				>
					<tr>
						<th class="text-center text-lg" colspan={(schema?.length ?? 1) + 2}>
							<div class="border-0 m-6">{$textContent}</div>
							<hr />
						</th>
					</tr>
					<tr contenteditable={false}>
						<th scope="col" class="px-4 py-1">
							<button id="fieldToView">
								<Bars4 />
							</button>
						</th>

						{#each schema ?? [] as item}
							<th scope="col" class="px-4 py-1">
								<form
									action={`${$page.url}`}
									on:submit={(e) => {
										let inputElementToChange = document.querySelector(`input[id="${item?.id}"]`);
										if (inputElementToChange instanceof HTMLInputElement) {
											// Change the input element's value
											if (inputElementToChange.value?.includes('-')) {
												inputElementToChange.value = inputElementToChange.value?.replace('-', '');
											} else {
												inputElementToChange.value = '-' + inputElementToChange.value;
											}
										}
									}}
								>
									<input
										type="hidden"
										value={$page.url.searchParams.get('filter') || ''}
										name="filter"
									/>
									<input type="hidden" value={item?.name} id={item?.id} name="sort" />
									<button class="" type="submit">
										{#if item.name == $page.url.searchParams.get('sort')}
											<ChevronUp />
										{:else if ($page.url.searchParams.get('sort') ?? '')?.includes(item.name) && ($page.url.searchParams.get('sort') ?? '')?.includes('-')}
											<ChevronDown />
										{:else}
											<ChevronUpDown />
										{/if}
									</button>
								</form>
							</th>
						{/each}
						<th scope="col1" class="px-4 py-3" />
					</tr>
					<!-- field names are displayed from here -->
					<tr>
						<th scope="col" class="px-4 py-1">
							<Checkbox
								checked={allCheckedRecords.includes('__all__')}
								on:change={(e) => {
									checkedRecordsFxn(e, '__all__');
								}}
							/>
						</th>
						{#each schema ?? [] as item}
							<th scope="col" class="px-4 py-1">
								{item?.name?.split('_')?.join(' ')}
							</th>
						{/each}
						<th scope="col" class="px-4 py-1"> time </th>
					</tr>
					<!-- end of field diplays -->
				</thead>
				<tbody class={`${fetching ? 'bg-slate-400 animate-ping' : ''}`}>
					{#each data?.resultList?.items ?? [] as item}
						<TableRowCustom
							onOpen={() => {
								isOpen = true;
								record = item;
								// recordPreviewPanel.show(item.id)
								recordUpsertPanel?.show(item.id)
							}}
							onViewRecord={() => {
								// isView = true;
								// record = item;
								recordPreviewPanel.show(item.id)
							}}
							target={item.id}
						>
							<TableBodyCell class="px-4 py-1">
								<Checkbox
									checked={allCheckedRecords.includes(item.id)}
									on:change={(e) => {
										checkedRecordsFxn(e, item?.id);
									}}
								/>
							</TableBodyCell>
							{#each schema ?? [] as schema_item}
								<td class="px-4 py-1">
									<div class="tems-center">
										{#if schema_item?.type == 'date'}
											{dateTimeFormatter(item[schema_item?.name])}
										{:else if schema_item.type == 'json' && typeof item[schema_item?.name] == 'object'}
											<div id={`json-${item?.id}`}>
												{JSON.stringify(item[schema_item?.name])?.slice(0, 50)}....
												<Popover
													class="w-auto text-sm font-medium custom-scrollbar overflow-x-auto overflow-y-hidden"
													title={`${schema_item?.name}`}
													triggeredBy={`#json-${item?.id}`}
												>
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
												</Popover>
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
											{#await getPbImageUrl(item, schema_item?.options?.maxSelect == 1 ? item[schema_item?.name] : Array.isArray(item[schema_item?.name]) && item[schema_item?.name].length > 0 ? item[schema_item?.name][0] : '', undefined) ?? '' then value}
												<Avatar rounded src={value ?? ''} />
											{/await}
										{:else if schema_item.type == 'editor'}
											{item[schema_item?.name]?.slice(0, 50)}....
										{:else if schema_item.type == 'text'}
											{item[schema_item?.name]?.slice(0, 50)}
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
							{/each}
							<TableBodyCell>
								<div class="relative inline-block text-left" id={`time-${item?.id}`}>
									<div class="cursor-pointer">&#128337</div>
								</div>
							</TableBodyCell>
						</TableRowCustom>
						<Popover
							class="w-auto text-sm font-light custom-scrollbar overflow-x-auto overflow-y-hidden"
							title={`Time Data`}
							triggeredBy={`#time-${item?.id}`}
						>
							<pre>Created: {dateTimeFormatter(item.created)}</pre>
							<pre>Updated: {dateTimeFormatter(item.updated)}</pre>
						</Popover>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
{/if}
<Popover
	placement="right-start"
	trigger="click"
	title="Invisible Fields"
	class="w-auto text-xs font-light"
	triggeredBy={`#fieldToView`}
>
	{#each data?.table?.schema ?? [] as field}
		<Toggle
			id={field?.id}
			name={field?.name}
			value=""
			checked={fieldsToView.includes(field?.id) ?? false}
			on:change={(e) => onChange(e, field)}
			class="text-xs font-light m-2"
		>
			{field?.name}
		</Toggle>
	{/each}
</Popover>
