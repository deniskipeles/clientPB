<!-- DynamicForm.svelte -->
<script lang="ts">
	import { getPbImageUrl } from '$lib/utils';
	import { Avatar, Button, Textarea, Toggle } from 'flowbite-svelte';

	export let dataForm: RecordModel; // The JSON data
	export let onClose: Function;

	import type { RecordModel } from 'pocketbase';
	import { applyAction, enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import RelationTable from './RelationTable.svelte';
	import RecordPreviewPanel from './records/RecordPreviewPanel.svelte';
	import { activeCollection } from '$lib/stores/collections';
	import CommonHelper from '$lib/utils/CommonHelper';

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
				onClose();
				await applyAction(result);
				await invalidateAll();
			}
			loading = false;
		};
	};

	$: fields =
		$page.data.tables.find(
			(i: any) =>
				i?.name == $page?.params?.slug?.replace(`${$page?.data?.user?.collectionName}_view_`, '')
		)?.schema ?? [];

		
		
	let recordPreviewPanel:any;
</script>
<button on:click={recordPreviewPanel.show('test')} type="button">show</button>
<RecordPreviewPanel
    bind:this={recordPreviewPanel}
    collection={$activeCollection}
    on:hide={() => { console.log('overlay hide')}}
/>

<form method="post" action="/api/records" use:enhance={onSubmit}>
	<input type="hidden" value={$page?.params?.slug} name="collection" />
	<input type="hidden" value={dataForm?.id ?? ''} name="RECORD_ID" />
	{#each fields as value}
		<div class="gap-2">
			<div class="bg-gray-400 m-2 rounded p-4 w-full">
				<label for={value?.id} class="block text-gray-700 text-sm uppercase">{value?.name}</label>
				{#if value.type === 'email'}
					<input
						type="email"
						id={value?.id}
						name={value?.name}
						value={dataForm[value.name] ?? ''}
						class="w-full px-3 py-2 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
					/>
				{/if}
				{#if value?.type === 'bool'}
					<Toggle
						id={value?.id}
						name={value?.name}
						value=""
						checked={dataForm[value.name] ?? false}
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
						value={dataForm[value.name] ?? ''}
						class="w-full px-3 py-2 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
					/>
				{/if}
				{#if value.type === 'number'}
					<input
						type="number"
						id={value?.id}
						name={value?.name}
						value={dataForm[value.name] ?? ''}
						class="w-full px-3 py-2 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
					/>
				{/if}
				{#if value.type === 'text'}
					<input
						type="text"
						id={value?.id}
						name={value?.name}
						value={dataForm[value.name] ?? ''}
						class="w-full px-3 py-2 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
					/>
				{/if}
				{#if value.type === 'editor'}
					<Textarea id={value?.id} name={value?.name} value={dataForm[value.name] ?? ''} rows="4" />
				{/if}
				{#if value.type === 'json'}
					<pre
					class="m-4 overflow-auto border-0"
						contenteditable={true}
						on:input={(e) => {
							let inputElementToChange = document.querySelector(`input[name="${value?.name}"]`);
							if (
								inputElementToChange instanceof HTMLInputElement &&
								inputElementToChange instanceof HTMLElement &&
								e.target instanceof HTMLInputElement &&
								e.target instanceof HTMLElement
							) {
								try {
									inputElementToChange.value = JSON.stringify(JSON.parse(e?.target?.value));
									e.target.value = JSON.stringify(JSON.parse(e?.target?.value));
								} catch (error) {}
							}
						}}>
				{JSON.stringify(dataForm[value.name])}
				</pre>
					<input
						type="hidden"
						id={value?.id}
						name={value?.name}
						value={JSON.stringify(dataForm[value.name] ?? '')}
					/>
				{/if}
				{#if value.type === 'relation' && dataForm?.expand}
					<RelationTable expandedData={dataForm?.expand[value.name]} field={value} />
				{/if}
				{#if value.type === 'file'}
					{#if value?.options?.mimeTypes?.includes('image')}
						<Avatar
							rounded
							src={getPbImageUrl(
								dataForm,
								value?.options?.maxSelect == 1
									? dataForm[value.name]
									: Array.isArray(dataForm[value.name]) && dataForm[value.name]?.length > 0
									? dataForm[value.name][0]
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
