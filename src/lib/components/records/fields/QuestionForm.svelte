<script lang="ts">
	import AiPromptingForm from '$lib/components/base/AiPromptingForm.svelte';
	import AutoExpandTextarea from '$lib/components/base/AutoExpandTextarea.svelte';
	import Draggable from '$lib/components/base/Draggable.svelte';
	import Field from '$lib/components/base/Field.svelte';
	import OverlayPanel from '$lib/components/base/OverlayPanel.svelte';
	import QaList from '$lib/components/base/QAList.svelte';
	import { addErrorToast } from '$lib/stores/toasts';
	import { QUESTION_CONSTANT } from '$lib/utils/CONSTANTS';
	import CommonHelper from '$lib/utils/CommonHelper';
	import { onMount } from 'svelte';

	export let value = QUESTION_CONSTANT;
	export let setJson: Function;
	export let field = { name: '' };
	let showOverlay = false;
	let questionPanel: any;
	// let questionAiPanel: any;
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
	$: if (Array.isArray(value) && value.length && typeof value[0].question == 'string') {
		let newArr: any[] = [];
		for (const val of value) {
			newArr = [...newArr, CommonHelper.getAnsFromArray(val)];
		}
		value = newArr;
	}
	onMount(() => {
		showOverlay = true;
	});

	let answer = '';
</script>

{#if showOverlay}
	{#if field.name == 'question'}
		<button class="btn" on:click={() => questionPanel.show()} type="button">use form</button>
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
		</svelte:fragment>
		<!-- <AiPromptingForm {value} {field} {setAiValues} {questionAiPanel} /> -->

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
			<QaList qValues={Array.isArray(value) ? value : [value]} />
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
