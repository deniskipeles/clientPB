<script lang="ts">
	import TextField from '../records/fields/TextField.svelte';
	import Draggable from './Draggable.svelte';

	type Value = {
		question: string;
		marks: number;
		answers: { correct: boolean; answer: string }[];
	};
	let value: Value = {
		question: '',
		marks: 1,
		answers: []
	};

	export let qValues: any[] = Array.isArray(value) ? value : [value];
	$: if (typeof qValues == 'string') {
		try {
			qValues = JSON.parse(qValues);
		} catch (error) {}
	}

	function deselect(indexQuestion: number, indexAnswer: number) {
		var record = qValues[indexQuestion];
		record.answers = record.answers?.filter((val: any, index: number) => index != indexAnswer);
		qValues[indexQuestion] = record;
	}
	function toggle(indexQuestion: number, indexAnswer: number) {
		var record = qValues[indexQuestion];
		record.answers[indexAnswer].correct = !record?.answers[indexAnswer]?.correct;
		qValues[indexQuestion] = record;
	}
	function editAnswer(indexQ: number, indexA: number) {
		editAnswerAt = indexA;
		editQuestionAt = indexQ;
	}

	function editQuestion(indexQ: number) {
		editQuestionAt = indexQ;
		editAnswerAt = -1;
	}
	function deleteQuestion(indexQ: number) {
		qValues = qValues.filter((val, index) => index != indexQ);
		editQuestionAt = -1;
		editAnswerAt = -1;
	}
	$: editAnswerAt = -1;
	$: editQuestionAt = -1;
</script>

{#if Array.isArray(qValues)}
	{#each qValues as value, indexQ}
		<div class="picker-list m-b-base">
			<p class="flex">
				<strong
					>({indexQ + 1})
					{#if editQuestionAt == indexQ && editAnswerAt == -1}
						<TextField
							bind:value={qValues[indexQ].question}
							field={{ name: 'Question', type: 'text' }}
						/>
					{:else}
						{value.question}
					{/if}
				</strong>
				{'   '}
				<button
					type="button"
					title="edit this question"
					class="btn btn-circle btn-transparent btn-hint btn-xs"
					on:click={() => editQuestion(indexQ)}
				>
					<i class="ri-edit-line" />
				</button>
				{'   '}
				<button
					type="button"
					title="Remove"
					class="btn btn-circle btn-transparent btn-hint btn-xs"
					on:click={() => deleteQuestion(indexQ)}
				>
					<i class="ri-close-line" />
				</button>
			</p>
			<div class="list picker-list m-b-base">
				{#each value.answers as record, indexA}
					{@const selected = record.correct == true}
					<Draggable bind:list={value.answers} index={indexA} let:dragging let:dragover>
						<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<div
							tabindex="0"
							class="list-item handle"
							class:selected
							class:disabled={false}
							on:click={() => toggle(indexQ, indexA)}
							on:keydown={(e) => {}}
						>
							{#if selected}
								<i class="ri-checkbox-circle-fill txt-success" />
							{:else}
								<i class="ri-checkbox-blank-circle-line txt-disabled" />
							{/if}
							<div class="content">
								<span class="label" class:label-danger={dragging} class:label-warning={dragover}>
									{#if editAnswerAt == indexA && editQuestionAt == indexQ}
										<TextField
											bind:value={qValues[indexQ].answers[indexA].answer}
											field={{ name: 'answer', type: 'text' }}
										/>
									{:else}
										{record.answer}
									{/if}
									{'   '}
									<button
										type="button"
										title="edit this answer"
										class="btn btn-circle btn-transparent btn-hint btn-xs"
										on:click={() => editAnswer(indexQ, indexA)}
									>
										<i class="ri-edit-line" />
									</button>
									{'   '}
									<button
										type="button"
										title="Remove"
										class="btn btn-circle btn-transparent btn-hint btn-xs"
										on:click={() => deselect(indexQ, indexA)}
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
	{/each}
{/if}
