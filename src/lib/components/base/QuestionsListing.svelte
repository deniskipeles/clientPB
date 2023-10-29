<script lang="ts">
	import Draggable from '$lib/components/base/Draggable.svelte';
	import OverlayPanel from '$lib/components/base/OverlayPanel.svelte';
	import { pb as ApiClient } from '$lib/pocketbase';
	import type { RecordModel } from 'pocketbase';
	import { createEventDispatcher, onMount } from 'svelte';
	import { addErrorToast, addSuccessToast } from '$lib/stores/toasts';
	import { page } from '$app/stores';
	import { confirm } from '$lib/stores/confirmation';

	let showOverlay = false;
	onMount(() => (showOverlay = true));

	function deselect(record: Answer, q: string) {
		answers = answers.map((i) => {
			if (i.question == q) {
				i.answers = i.answers.filter((i) => i != record);
				i.answers = i.answers;
				return i;
			}
			return i;
		});
	}
	function toggle(record: Answer, q: string) {
		answers = answers.map((i) => {
			if (i.question == q) {
				if (i.answers.includes(record)) {
					i.answers = i.answers.filter((i) => i != record);
				} else {
					// CommonHelper.removeByKey(answers, 'answer', record.answer);
					i.answers = [...i.answers, record];
				}
				return i;
			}
			return i;
		});
	}

	const dispatch = createEventDispatcher();
	let isSaving = false;
	export let collection: RecordModel;
	export let collectionUpsert: RecordModel;

	function saveConfirm() {
		const msg = `Do you really want to save Your Answers?`;

		confirm(msg, saveSelected);
	}

	async function saveSelected() {
		if (isSaving || !collectionUpsert?.id) {
			return;
		}
		if (!$page.data?.user?.collectionName?.includes('student')) {
			addErrorToast('Only students are allowed to answer.');
			return;
		}
		isSaving = true;

		try {
			let formData = { answers, student: $page.data?.user?.id, test: record?.id };
			let rec = await await ApiClient.collection(collectionUpsert.id).create(formData);
			addSuccessToast(`Successfully save the records'.`);

			dispatch('save', rec);
			recordPanel.hide();
		} catch (err) {
			if (!err?.isAbort) {
				ApiClient.error(err, err?.status != 400); // silence filter errors
			}
			ApiClient.error(err);
		} finally {
			isSaving = false;
		}
	}

	export function show(model) {
		load(model);

		return recordPanel?.show();
	}

	let recordPanel: any;
	let record: RecordModel;
	let isLoading = false;
	export function hide() {
		isLoading = false;
        answers = []
        record = {}
		return recordPanel?.hide();
	}

	async function load(model: string) {
		record = {}; // reset

		isLoading = true;

		record = (await resolveModel(model)) || {};

		if (record?.expand && record?.expand?.questions && Array.isArray(record?.expand?.questions)) {
			for (const q of record?.expand?.questions) {
				const question = q?.question?.question ?? 'There is error with this quiz.';
				answers.push({ answers: [], question });
			}
		}

		isLoading = false;
	}

	async function resolveModel(model: string | RecordModel) {
		const displayFields = (
			collection?.schema?.filter((f: any) => f.type == 'relation')?.map((f: any) => f.name) || []
		)?.join(',');
		// console.log(displayFields)
		if (model && typeof model === 'string') {
			// load from id
			try {
				return await ApiClient.collection(collection.id).getOne(model, {
					expand: displayFields
				});
			} catch (err: any) {
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
	type Answer = {
		answer: string;
		correct: boolean;
	};
	type Question = {
		answers: Answer[];
		question: string;
	};
	let answers: Question[] = [];
	// let answers = answers_partial;
</script>

{#if showOverlay}
	<OverlayPanel
		bind:this={recordPanel}
		popup
		class="overlay-panel-xl"
		on:hide
		on:show
		{...$$restProps}
	>
		<svelte:fragment slot="header">
			<h4>
				Attempt <strong>Question & Answers</strong> records
			</h4>
		</svelte:fragment>

		{#if record?.expand && record?.expand?.questions && Array.isArray(record?.expand?.questions)}
			{@const questions = record.expand.questions ?? []}
			{#each questions as questionObj, i}
				{@const question = questionObj.question}
				<h5 class="section-title">{question?.question}</h5>
				<div class="tab-items">
					<div class="list picker-list m-b-base">
						{#each question?.answers ?? [] as answer, i (answer?.answer)}
							{@const selected_answers = answers.find((i) => i.question == question.question) ?? {}}
							{@const selected = selected_answers?.answers?.includes(answer) ?? false}
							{@const disabled = !(
								(question.answers?.filter((i) => i.correct == true)).length >
								selected_answers.answers?.length
							)}
							<!-- <Draggable bind:list={students} index={i} let:dragging let:dragover> -->
							<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
							<!-- svelte-ignore a11y-no-static-element-interactions -->
							<div
								tabindex="0"
								class="list-item handle"
								class:selected
								class:disabled
								on:click={() =>
									!disabled && !selected
										? toggle(answer, question.question)
										: deselect(answer, question.question)}
								on:keydown={(e) => {
									if (e.code === 'Enter' || e.code === 'Space') {
										e.preventDefault();
										e.stopPropagation();
										toggle(answer, question.question);
									}
								}}
							>
								{#if selected}
									<i class="ri-checkbox-circle-fill txt-success" />
								{:else}
									<i class="ri-checkbox-blank-circle-line txt-disabled" />
								{/if}
								<div class="content">
									{answer.answer}
								</div>
							</div>
							<!-- </Draggable> -->
						{/each}
						{#if Array.isArray(answers[i]?.answers) && answers[i]?.answers?.length}
							<h5 class="section-title">
								Selected ({answers[i]?.answers?.length} of MAX {(question.answers?.filter(
									(i) => i.correct == true
								)).length})
							</h5>
							<div class="selected-list flex">
								{#each answers[i]?.answers ?? [] as slt_answer, ij}
									<Draggable bind:list={answers[i].answers} index={ij} let:dragging let:dragover>
										<span
											class="label"
											class:label-danger={dragging}
											class:label-warning={dragover}
										>
											{slt_answer.answer}
											<button
												type="button"
												title="Remove"
												class="btn btn-circle btn-transparent btn-hint btn-xs"
												on:click={() => deselect(slt_answer, question.question)}
											>
												<i class="ri-close-line" />
											</button>
										</span>
									</Draggable>
								{/each}
							</div>
						{/if}
					</div>
				</div>
			{/each}
		{/if}

		<svelte:fragment slot="footer">
			<button type="button" class="btn btn-transparent" on:click={() => hide()}>
				<span class="txt">Cancel</span>
			</button>
			<button type="button" class="btn" on:click={() => saveConfirm()}>
				<span class="txt">Save Attendances</span>
			</button>
		</svelte:fragment>
	</OverlayPanel>
{/if}
