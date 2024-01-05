<script lang="ts">
	import { onMount } from 'svelte';
	import AutoExpandTextarea from './AutoExpandTextarea.svelte';
	import OverlayPanel from './OverlayPanel.svelte';
	import { writable } from 'svelte/store';
	import { addErrorToast } from '$lib/stores/toasts';
	import Field from './Field.svelte';
	import CommonHelper from '$lib/utils/CommonHelper';
	import JsonField from '../records/fields/JsonField.svelte';
	import ai from '$lib/utils/ai';
	import { extractJSON, getJson } from '$lib/utils';
	import Draggable from './Draggable.svelte';
	import TextField from '../records/fields/TextField.svelte';
	import { page } from '$app/stores';

	let prompt = '';
	let context = '';
	$: markdown = '';
	const prompting = writable(false);
	const saving = writable(false);
	const headers = {
		'Content-Type': 'application/json'
	};
	let res: AiResponse = {
		questions: [
			{
				question: 'question',
				marks: 3,
				answers: [
					['answer', false],
					['answer2', true]
				]
			}
		],
		totalMarks: 10,
		title: 'title'
	};
	type AiResponse = {
		questions: {
			question: string;
			marks: number;
			answers: (string | boolean)[][];
		}[];
		totalMarks: number;
		title: string;
	};
	async function onSubmit() {
		prompting.set(true);
		let query = ai.questions;
		prompt = await cleanString(prompt);
		context = await cleanString(context);
		query = query.replaceAll('<<prompt>>', prompt);
		query = query.replaceAll('<<context>>', context);

		const strSchool = JSON.stringify($page.data?.school ?? {});
		console.log(strSchool);
		const input: any = {
			prompt: query,
			key: $page.data?.school?.ai_key ?? 'none provided',
			url: $page.url.hostname,
			type: 'school',
			info: strSchool
		};

		const queryString = Object.keys(input)
			.map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(input[key]))
			.join('&');

		// console.log(queryString);

		const url = `https://ktechs.xyz/api/ai?${queryString}`;

		await fetch(url, {
			method: 'GET'
		})
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				setQs(data.res);
			})
			.catch((error) => {
				console.error('Error:', error);
				addErrorToast(error + '');
			});

		// console.log(query.length);
		// await fetch('https/api/ai', {
		// 	method: 'POST',
		// 	headers: headers,
		// 	body: JSON.stringify({ prompt: query })
		// })
		// 	.then((response) => response.json())
		// 	.then((data) => {
		// 		console.log(data)
		// 		if (data?.success) {
		// 			markdown = data;
		// 			responseText = data;
		// 			jsonData = getJson(data);
		// 		}
		// 		if (data?.error) {
		// 			addErrorToast(JSON.stringify(data?.error));
		// 		}
		// 	})
		// 	.catch((error) => {
		// 		console.log(error);
		// 		addErrorToast(JSON.stringify(error));
		// 	})
	}
	const setQs = (responseText: string) => {
		try {
			const result = getJson(responseText) as AiResponse;
			if (result.questions) {
				// console.log(result);
				res = result;
				for (const obj of res.questions) {
					var q: any[] = [];
					try {
						async function qFxn() {
							q =
								typeof questions == 'string'
									? JSON.parse(await cleanString(questions))
									: Array.isArray(questions)
									? questions
									: [];
						}
						qFxn();
					} catch (error) {}
					questions = [
						...CommonHelper.toArray(q),
						{ ...obj, answers: getAnsFromArray(obj.answers) }
					];
					qValues = questions.map((val) => {
						return {
							...val,
							answers: getAnsFromArray(val.answers)
						};
					});
				}
			}
		} catch (error) {}
	};
	const getAnsFromArray = (answers: (string | boolean)[][]) => {
		const arr: Record<string, any>[] = [];
		for (const ans of CommonHelper.toArray(answers)) {
			let obj: Record<string, any> = {};
			if (Array.isArray(ans)) {
				obj['answer'] = ans[0];
				obj['correct'] = ans[1];
			} else {
				if (!Array.isArray(ans) && typeof ans == 'object') {
					obj = ans;
				}
			}
			arr.push(obj);
		}
		return arr;
	};
	let responseText = `
		This is part of response text
		{
		"title": "Bard Knowledge Quiz",
		"totalMarks": 50,
		"questions": [
			{
			"question": "What is Bard?",
			"marks": 10,
			"answers": [
				{ "answer": "A large language model from Google AI", "correct": true },
				{ "answer": "A musical instrument", "correct": false },
				{ "answer": "A character in a Shakespeare play", "correct": false }
			]
			},
			{
			"question": "Identify the Bard logo.",
			"marks": 5,
			"image": "https://ai.google/static/images/bard/bard-logo.png",
			"answers": [
				{ "answer": "The logo with a blue circle and a stylized B in the center", "correct": true },
				{ "answer": "The logo with a red guitar", "correct": false },
				{ "answer": "The logo with a green book", "correct": false }
			]
			}
		]
		}
		Also part of response
		`;
	async function cleanString(str: string) {
		str = str.replaceAll('		', ' ');
		str = str.replaceAll('	', ' ');
		str = str.replaceAll('\r', ' ');
		str = str.replaceAll('\t', ' ');
		str = str.replaceAll('\n', ' ');
		return str;
	}

	let showOverlay = false;
	onMount(() => (showOverlay = true));
	let questionAiPanel: any;
	let questions = res.questions;
	let isLoading = false;
	export function hide() {
		isLoading = false;
		questions = [];
		return questionAiPanel?.hide();
	}

	let jsonData = {};

	var Values: any[] = [];
	type Value = {
		question: string;
		answers: { correct: boolean; answer: string }[];
	};
	var value: Value = {
		question: '',
		answers: []
	};

	let qValues: any[] = [value];

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
	let formView = true;

	function editAnswer(indexQ: number, indexA: number) {
		editAnswerAt = indexA;
		editQuestionAt = indexQ;
	}

	function editQuestion(indexQ: number) {
		editQuestionAt = indexQ;
		editAnswerAt = -1;
	}
	$: editAnswerAt = -1;
	$: editQuestionAt = -1;
</script>

{#if showOverlay}
	<div>
		<button class="btn" on:click={() => questionAiPanel.show()} type="button"
			>Use <strong>ai</strong> to generate questions</button
		>
	</div>
	<OverlayPanel
		bind:this={questionAiPanel}
		popup
		class="overlay-panel-xl"
		on:hide
		on:show
		{...$$restProps}
	>
		<svelte:fragment slot="header">
			<h4>
				Prompting <strong>ai</strong> for help.
			</h4>
			<h5>
				After the response scroll down to view your <strong>questions</strong>.
			</h5>
		</svelte:fragment>

		<JsonField field={{ name: 'Context or Notes or Url', type: 'text' }} bind:value={context} />

		<Field class="form-field" name={'answer'} let:uniqueId>
			<label for={uniqueId}>
				<i class={CommonHelper.getFieldTypeIcon('text')} />
				<span class="txt">Your Prompt</span>
			</label>
			<div class="flex">
				<AutoExpandTextarea
					id={uniqueId}
					required={true}
					bind:value={prompt}
					placeholder="Enter your prompt here"
					class="textarea form-field border-pink-100 border-spacing-2"
				/>
				<button
					type="button"
					title="Prompt ai"
					class="btn btn-hint btn-xs"
					on:click={() => {
						onSubmit();
					}}
				>
					<i class="ri-send-line ri-send" /> Send
				</button>
			</div>
		</Field>

		<h3><strong>List Of Questions</strong></h3>
		<button
			type="button"
			title="Prompt ai"
			class="btn btn-hint btn-xs"
			on:click={() => (formView = !formView)}
		>
			<i class="ri-send-line ri-send" />toggle to {!formView ? 'json view' : 'form view'}
		</button>
		{#if !formView}
			<JsonField field={{ name: 'Questions' }} bind:value={questions} />
		{:else}
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
									on:keydown={(e) => {
										// if (e.code === 'Enter' || e.code === 'Space') {
										// 	e.preventDefault();
										// 	e.stopPropagation();
										// 	toggle(indexQ, indexA);
										// }
									}}
								>
									{#if selected}
										<i class="ri-checkbox-circle-fill txt-success" />
									{:else}
										<i class="ri-checkbox-blank-circle-line txt-disabled" />
									{/if}
									<div class="content">
										<span
											class="label"
											class:label-danger={dragging}
											class:label-warning={dragover}
										>
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

		<svelte:fragment slot="footer">
			<button type="button" class="btn btn-transparent" on:click={() => hide()}>
				<span class="txt">Cancel</span>
			</button>
			<button type="button" class="btn" on:click={() => {}}>
				<span class="txt">Save Questions</span>
			</button>
		</svelte:fragment>
	</OverlayPanel>
{/if}
