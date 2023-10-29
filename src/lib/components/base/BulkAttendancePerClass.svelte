<script lang="ts">
	import Draggable from '$lib/components/base/Draggable.svelte';
	import Field from '$lib/components/base/Field.svelte';
	import OverlayPanel from '$lib/components/base/OverlayPanel.svelte';
	import { pb as ApiClient } from '$lib/pocketbase';
	import CommonHelper from '$lib/utils/CommonHelper';
	import type { RecordModel } from 'pocketbase';
	import { createEventDispatcher, onMount } from 'svelte';
	import RecordInfo from '../records/RecordInfo.svelte';
	import { addErrorToast, addSuccessToast } from '$lib/stores/toasts';
	import { page } from '$app/stores';
	import { confirm } from '$lib/stores/confirmation';
	import DateField from '../records/fields/DateField.svelte';

	let showOverlay = false;
	let classesPanel: any;
	export function hide() {
		return classesPanel?.hide();
	}

	onMount(async () => {
		showOverlay = true;
		try {
			select_options = await ApiClient.collection('classes').getFullList(50, {
				filter: `active = ${true}`,
				expand: 'subjects',
				sort: '-created'
			});
			if (select_options.length) {
				loadStudents(select_options[0])
			}
		} catch (err) {
			ApiClient.error(err);
		}
	});

	let class_selected:RecordModel
	let subject:string
	async function loadStudents(record: RecordModel) {
		subject = record?.subjects[0]
		class_selected = record
		try {
			students = await ApiClient.collection('classes_students_enrollments').getFullList(50, {
				filter: `class = "${record.id}" && active = ${true}`,
				expand: 'student',
				sort: '-created'
			});
		} catch (err) {
			ApiClient.error(err);
		}
	}
	function deselect(record: RecordModel) {
		CommonHelper.removeByKey(students, 'id', record.id);
		students = students;
	}
	function toggle(record: RecordModel) {
		students = students.map((i) => {
			if (i.id == record.id) {
				i.present = !record?.present;
				return i;
			}
			return i;
		});
	}
	let select_options: RecordModel[] = [];
	let students: RecordModel[] = [];

	const dispatch = createEventDispatcher();
	$: totalBulkSelected = students.length;
	let isSaving = false;
	export let collectionUpsert: RecordModel;
	let bulkSelected: any[] = [];
	function selectAllRecords() {
		let recs = [];
		for (const record of students) {
			record.registered_by = $page.data?.user?.id;
			record.date = date;
			record.subject = subject;
			const schema: any[] = collectionUpsert?.schema;
			let formData: any = {};
			schema.forEach((element) => {
				formData[element['name']] = record[element['name']] ?? null;
			});
			recs.push(formData);
		}

		bulkSelected = recs;
	}
	function saveSelectedConfirm() {
		const msg = `Do you really want to save the selected ${
			totalBulkSelected === 1 ? 'record' : 'records'
		}?`;

		confirm(msg, saveSelected);
	}
	let saved = 0;
	async function saveSelected() {
		saved = 0;
		selectAllRecords();
		if (isSaving || !totalBulkSelected || !collectionUpsert?.id) {
			return;
		}

		let promises = [];
		for (const formData of bulkSelected) {
			try {
				await promises.push(await ApiClient.collection(collectionUpsert.id).create(formData));
				saved += 1;
			} catch (err) {
				ApiClient.error(err);
			}
		}

		isSaving = true;

		return Promise.all(promises)
			.then(() => {
				addSuccessToast(
					`Successfully save (${saved} of ${students.length}) selected ${
						totalBulkSelected === 1 ? 'record' : 'records'
					}.`
				);

				dispatch('save', bulkSelected);

				students = [];
				classesPanel.hide();
			})
			.catch((err) => {
				if (!err?.isAbort) {
					ApiClient.error(err, err?.status != 400); // silence filter errors
				}
				ApiClient.error(err);
			})
			.finally(() => {
				isSaving = false;
			});
	}
	let field = {
		name: 'Date For Attendance',
		required: true
	};
	let date = new Date().toISOString();
</script>

<button type="button" class="btn btn-outline" on:click={() => classesPanel.show()}>
	<i class="ri-pencil-line" />
	<span class="txt">Bulk Attendances Per Class</span>
</button>
{#if showOverlay}
	<OverlayPanel
		bind:this={classesPanel}
		popup
		class="overlay-panel-xl"
		on:hide
		on:show
		{...$$restProps}
	>
		<svelte:fragment slot="header">
			<h4>
				Add <strong>Attendances</strong> records in bulk.
			</h4>
		</svelte:fragment>

		<h5 class="section-title">classes(Click to load students)</h5>
		<div class="selected-list">
			{#each select_options as record, i}
				<span class="label">
					<button
						type="button"
						title="Remove"
						class="btn btn-circle btn-transparent btn-hint btn-xs"
						on:click={async () => await loadStudents(record)}
					>
					<RecordInfo {record} />
					<i class="ri-check-line" />
					</button>
				</span>
			{/each}
		</div>
		<div class="tab-items">
			<DateField {field} bind:value={date} />
			{#if $page.params?.slug?.includes('lesson')}
			<Field class="form-field required" name="Subject" let:uniqueId>
				<label for={uniqueId}>
					<i class={CommonHelper.getFieldTypeIcon('select')} />
					<span class="txt">Subject:</span>
				</label>
				<select name="s" id="s" bind:value={subject}>
					{#if class_selected}
						 {#each class_selected?.expand?.subjects  as subjectObj}
							  <option value={subjectObj?.id}>{subjectObj?.name}</option>
						 {/each}
					{/if}
				</select>
			</Field>
			{/if}
			<div class="list picker-list m-b-base">
				{#each students as record, i (record?.id)}
					{@const selected = record.present == true}
					<Draggable bind:list={students} index={i} let:dragging let:dragover>
						<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<div
							tabindex="0"
							class="list-item handle"
							class:selected
							class:disabled={false}
							on:click={() => toggle(record)}
							on:keydown={(e) => {
								if (e.code === 'Enter' || e.code === 'Space') {
									e.preventDefault();
									e.stopPropagation();
									toggle(record);
								}
							}}
						>
							{#if selected}
								<i class="ri-checkbox-circle-fill txt-success" />
							{:else}
								<i class="ri-checkbox-blank-circle-line txt-disabled" />
							{/if}
							<div class="content">
								<span class="label" class:label-danger={dragging} class:label-warning={dragover}>
									{#if record?.expand && record.expand?.student}
										<RecordInfo record={record.expand?.student} />
									{/if}
									<button
										type="button"
										title="Remove"
										class="btn btn-circle btn-transparent btn-hint btn-xs"
										on:click={() => deselect(record)}
									>
										<i class="ri-close-line" />
									</button>
								</span>
							</div>
						</div>
					</Draggable>
				{/each}
			</div>
		</div>

		<svelte:fragment slot="footer">
			<button type="button" class="btn btn-transparent" on:click={() => hide()}>
				<span class="txt">Cancel</span>
			</button>
			<button type="button" class="btn" on:click={() => saveSelectedConfirm()}>
				<span class="txt">Save Attendances</span>
			</button>
		</svelte:fragment>
	</OverlayPanel>
{/if}
