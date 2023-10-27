<!-- DynamicForm.svelte -->
<script lang="ts">
	import { getPbImageUrl } from '$lib/utils';
	import { Avatar, Button, Textarea, Toggle } from 'flowbite-svelte';

	import type { RecordModel } from 'pocketbase';
	import { applyAction, enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import RelationTable from './RelationTable.svelte';
	import { tablesTypes } from '$lib/utils/extract-types';
	import { stackForms } from '$lib/stores';

	export let dataReceivedByForm: RecordModel; // The JSON data
	export let collectionId = '';
	export let collectionFormNumber = '';
	export let full = false;
	// export let onClose: Function;

	let loading = false;
	const onSubmit: SubmitFunction = async ({ formData }) => {
		let formDataToJson: any = {};
		formData.forEach((value, key) => {
			formDataToJson[key] = value;
		});
		console.log(formDataToJson);

		loading = true;
		return async ({ result, formData }) => {
			console.log(result);
			if (result['type'] == 'success') {
				// onClose();
				await applyAction(result);
				await invalidateAll();
			}
			loading = false;
		};
	};

	$: schema =
		$page.data.tables.find((i: any) => i?.name == collectionId || i?.id == collectionId)?.schema ??
		[];
	$: table =
		$page.data.tables.find((i: any) => i?.name == collectionId || i?.id == collectionId) ?? {};
	const onClose = () => {
		stackForms.update((val) => {
			val = val?.filter((i) => i !== collectionFormNumber);
			return val;
		});
	};
</script>

{#if $stackForms.includes(collectionFormNumber)}
	<div
		id={collectionFormNumber}
		class="fixed inset-0 flex items-start ml-2 justify-center z-50"
		style="background-color: rgba(0, 0, 0, 0.5);"
		class:visible={$stackForms.includes(collectionFormNumber)}
	>
		<div
			class={`absolute custom-scrollbar overflow-auto inset-y-0 left-0 bg-white rounded-lg p-4 shadow-md w-full ${
				full ? '' : 'md:w-1/2'
			}`}
			class:translate-x-0={$stackForms.includes(collectionFormNumber)}
			class:translate-x-full={!$stackForms.includes(collectionFormNumber)}
		>
			<button
				class="absolute top-0 right-0 mt-2 mr-2 text-gray-500 hover:text-gray-700"
				on:click={onClose}
			>
				<svg
					class="h-5 w-5"
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

			<form method="post" action="/api/records" use:enhance={onSubmit}>
				{#if dataReceivedByForm?.id}
					<input type="hidden" value={dataReceivedByForm?.id ?? ''} name="RECORD_ID" />
				{/if}
				<input type="hidden" value={collectionId} name="collection" />
				{#each schema as value}
					<div class="gap-2">
						<div class="bg-gray-400 m-2 rounded p-4 w-full">
							<label for={value?.id} class="block text-gray-700 text-sm uppercase"
								>{value?.name}</label
							>
							{#if value.type === 'email'}
								<input
									type="email"
									id={value?.id}
									name={value?.name}
									value={dataReceivedByForm[value.name] ?? ''}
									class="w-full px-3 py-2 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
								/>
							{/if}
							{#if value?.type === 'bool'}
								<Toggle
									id={value?.id}
									name={value?.name}
									value=""
									checked={dataReceivedByForm[value.name] ?? false}
									on:change={(e) => {
										if (e.target instanceof HTMLInputElement && e.target instanceof HTMLElement) {
											e.target.value = JSON.stringify(e?.target?.checked);
										}
									}}
								>
									{value?.name}
								</Toggle>
							{/if}
							{#if value.type === 'date'}
								<input
									type="datetime-local"
									id={value?.id}
									name={value?.name}
									value={dataReceivedByForm[value.name] ?? ''}
									class="w-full px-3 py-2 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
								/>
							{/if}
							{#if value.type === 'number'}
								<input
									type="number"
									id={value?.id}
									name={value?.name}
									value={dataReceivedByForm[value.name] ?? ''}
									class="w-full px-3 py-2 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
								/>
							{/if}
							{#if value.type === 'text'}
								<input
									type="text"
									id={value?.id}
									name={value?.name}
									value={dataReceivedByForm[value.name] ?? ''}
									class="w-full px-3 py-2 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
								/>
							{/if}
							{#if value.type === 'editor'}
								<Textarea
									id={value?.id}
									name={value?.name}
									value={dataReceivedByForm[value.name] ?? ''}
									rows="4"
								/>
							{/if}
							{#if value.type === 'json'}
								<Textarea
									id={value?.id}
									name={value?.name}
									value={JSON.stringify(dataReceivedByForm[value.name] ?? '')}
									on:input={(e) => {
										if (e.target instanceof HTMLInputElement && e.target instanceof HTMLElement) {
											try {
												e.target.value = JSON.stringify(JSON.parse(e?.target?.value));
											} catch (error) {}
										}
									}}
									rows="4"
								/>
							{/if}
							{#if value.type === 'relation' && dataReceivedByForm?.expand}
								<RelationTable
									expandedData={dataReceivedByForm?.expand[value.name]}
									field={value}
								/>
							{/if}
							{#if value.type === 'file'}
								{#if value?.options?.mimeTypes?.includes('image')}
									<Avatar
										rounded
										src={getPbImageUrl(
											dataReceivedByForm,
											value?.options?.maxSelect == 1
												? dataReceivedByForm[value.name]
												: Array.isArray(dataReceivedByForm[value.name]) &&
												  dataReceivedByForm[value.name]?.length > 0
												? dataReceivedByForm[value.name][0]
												: '',
											undefined
										) ?? ''}
									/>
									<input
										multiple={value?.options?.maxSelect == 1 ? false : true}
										type="file"
										accept="image/*"
										id={value?.id}
										name={value?.name}
										class="w-full px-3 py-2 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
									/>
								{:else}
									<input
										multiple={value?.options?.maxSelect == 1 ? false : true}
										type="file"
										id={value?.id}
										name={value?.name}
										class="w-full px-3 py-2 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
									/>
									<!-- else content here -->
								{/if}
							{/if}
						</div>
					</div>
				{/each}
				<div>
					<Button class="w-full z-0" type="submit">Update</Button>
				</div>
			</form>
		</div>
	</div>
{/if}
