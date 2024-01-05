<script lang="ts">
	import AiPromptingForm from '$lib/components/base/AiPromptingForm.svelte';
	import AutoExpandTextarea from '$lib/components/base/AutoExpandTextarea.svelte';
	import Draggable from '$lib/components/base/Draggable.svelte';
	import Field from '$lib/components/base/Field.svelte';
	import OverlayPanel from '$lib/components/base/OverlayPanel.svelte';
	import { addErrorToast } from '$lib/stores/toasts';
	import { QUESTION_CONSTANT } from '$lib/utils/CONSTANTS';
	import CommonHelper from '$lib/utils/CommonHelper';
	import { onMount } from 'svelte';

	export let value = QUESTION_CONSTANT;
	export let setJson: Function;
	export let field = { name: '' };
	let showOverlay = false;
	let questionPanel: any;
	export function hide() {
		return questionPanel?.hide();
	}
	$: if (typeof value == 'string') {
		try {
			value = JSON.parse(value);
		} catch (error) {
			value = QUESTION_CONSTANT;
		}
	}
	onMount(() => (showOverlay = true));

	function deselect(record: { answer: string; correct: boolean }) {
		CommonHelper.removeByKey(value.answers, 'answer', record.answer);
		value.answers = value.answers;
	}
	function toggle(record: { answer: string; correct: boolean }) {
		value.answers = value.answers.map((i) => {
			if (i == record) {
				i.correct = !record.correct;
				return i;
			}
			return i;
		});
	}
	let answer = '';

	const setAiValues = (inValue: any) => {
		if (typeof inValue == 'object') {
			try {
				value = inValue;
			} catch (error) {
				console.log(error);
			}
		}
	};
</script>

{#if showOverlay}
	{#if field.name == 'question'}
		{' in json format'}<button class="btn" on:click={() => questionPanel.show()} type="button"
			>use question form</button
		>{'instead'}
	{/if}

	<OverlayPanel
		bind:this={questionPanel}
		popup
		class="overlay-panel-xl"
		on:hide
		on:show
		{...$$restProps}
	>
		<svelte:fragment slot="header">
			<h4>
				Add <strong>Question & Answers</strong> records
			</h4>
			<AiPromptingForm {value} {field} {setAiValues} />
		</svelte:fragment>

		<Field class="form-field required" name={'question'} let:uniqueId>
			<label for={uniqueId}>
				<i class={CommonHelper.getFieldTypeIcon('text')} />
				<span class="txt">{'Question'}</span>
			</label>
			<AutoExpandTextarea id={uniqueId} required={true} bind:value={value.question} />
		</Field>

		<Field class="form-field" name={'answer'} let:uniqueId>
			<label for={uniqueId}>
				<i class={CommonHelper.getFieldTypeIcon('text')} />
				<span class="txt">{'Add Answer'}</span>
			</label>
			<div class="flex">
				<AutoExpandTextarea
					id={uniqueId}
					required={true}
					bind:value={answer}
					placeholder="Enter your answer here and click add "
				/>
				<button
					type="button"
					title="Add Answer"
					class="btn btn-hint btn-xs"
					on:click={() => {
						if (answer.length > 0) {
							value.answers = [{ answer, correct: false }, ...value.answers];
							answer = '';
						} else {
							addErrorToast('The text should have more than or equal to 1 characters');
						}
					}}
				>
					<i class="ri-add-line" />add answer
				</button>
			</div>
		</Field>

		<div class="list picker-list m-b-base">
			{#each value.answers as record, i (record.answer)}
				{@const selected = record.correct == true}
				<Draggable bind:list={value.answers} index={i} let:dragging let:dragover>
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
								{record.answer}
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

		<svelte:fragment slot="footer">
			<button type="button" class="btn btn-transparent" on:click={() => hide()}>
				<span class="txt">Cancel</span>
			</button>
			<button
				type="button"
				class="btn"
				on:click={() => {
					setJson(value);
					questionPanel.hide();
				}}
			>
				<span class="txt">Set question</span>
			</button>
		</svelte:fragment>
	</OverlayPanel>
{/if}
