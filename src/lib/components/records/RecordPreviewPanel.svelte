<script>
	import { addErrorToast } from '$lib/stores/toasts';
	// import ApiClient from "$lib/utils/ApiClient";
	import OverlayPanel from '$lib/components/base/OverlayPanel.svelte';
	import { pb } from '$lib/pocketbase';
	import FormattedDate from '$lib/components/base/FormattedDate.svelte';
	import CopyIcon from '$lib/components/base/CopyIcon.svelte';
	import RecordFieldValue from '$lib/components/records/RecordFieldValue.svelte';
	import { page } from '$app/stores';
	import AnswersPreview from '../base/AnswersPreview.svelte';

	export let collection;

	let recordPanel;
	let record = {};
	let isLoading = false;

	$: hasEditorField = !!collection?.schema?.find((f) => f.type === 'editor');

	export function show(model) {
		load(model);

		return recordPanel?.show();
	}

	export function hide() {
		isLoading = false;
		return recordPanel?.hide();
	}

	async function load(model) {
		record = {}; // reset

		isLoading = true;

		record = (await resolveModel(model)) || {};

		isLoading = false;
	}

	async function resolveModel(model) {
		const displayFields = (
			collection?.schema?.filter((f) => f.type == 'relation')?.map((f) => f.name) || []
		)?.join(',');
		// console.log(displayFields)
		if (model && typeof model === 'string') {
			// load from id
			try {
				// return await ApiClient.collection(collection.id).getOne(model);
				return await pb.collection(collection.id).getOne(model, {
					expand: displayFields
				});
			} catch (err) {
				if (!err.isAbort) {
					hide();
					console.warn('resolveModel:', err);
					addErrorToast(`Unable to load record with id "${model}"`);
				}
			}

			return null;
		}

		return model;
	}
</script>

<OverlayPanel
	bind:this={recordPanel}
	class="record-preview-panel {hasEditorField ? 'overlay-panel-xl' : 'overlay-panel-lg'}"
	on:hide
	on:show
>
	<svelte:fragment slot="header">
		<h4>
			<strong>{collection?.name?.split('_view_')[1]?.split('_')?.join(' ')}</strong> record preview
		</h4>
	</svelte:fragment>

	<table class="table-border preview-table" class:table-loading={isLoading}>
		<tbody>
			<!-- <tr>
                <td class="min-width txt-hint txt-bold">id</td>
                <td class="col-field">
                    <div class="label">
                        <CopyIcon value={record.id} />
                        <span class="txt">{record.id || "..."}</span>
                    </div>
                </td>
            </tr> -->

			{#each collection?.schema as field}
				<tr>
					<td class="min-width txt-hint txt-bold capitalize">{field.name?.split('_')?.join(' ')}</td
					>
					<td class="col-field">
						{#if field?.name == 'questions' && record?.expand?.questions}
							{#each record?.expand?.questions ?? [] as item, pos}
								<tr>
									<p class="text-base">{pos + 1} {item?.question?.question}</p>
									<AnswersPreview answers={item?.question?.answers ?? []} />
								</tr>
								<hr />
							{/each}
						{:else}
							<RecordFieldValue {field} {record} />
						{/if}
					</td>
				</tr>
			{/each}

			{#if record.created}
				<tr>
					<td class="min-width txt-hint txt-bold">created</td>
					<td class="col-field"><FormattedDate date={record.created} /></td>
				</tr>
			{/if}

			{#if record.updated}
				<tr>
					<td class="min-width txt-hint txt-bold">updated</td>
					<td class="col-field"><FormattedDate date={record.updated} /></td>
				</tr>
			{/if}
		</tbody>
	</table>

	<svelte:fragment slot="footer">
		<button type="button" class="btn btn-transparent" on:click={() => hide()}>
			<span class="txt">Close</span>
		</button>
	</svelte:fragment>
</OverlayPanel>

<style lang="scss">
	.col-field {
		max-width: 1px; // text overflow workaround
	}
</style>
