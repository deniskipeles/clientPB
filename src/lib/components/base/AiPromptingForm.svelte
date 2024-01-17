<script lang="ts">
	import { onMount } from 'svelte';
	import AutoExpandTextarea from './AutoExpandTextarea.svelte';
	import OverlayPanel from './OverlayPanel.svelte';
	import { writable } from 'svelte/store';
	import { addErrorToast, addSuccessToast } from '$lib/stores/toasts';
	import Field from './Field.svelte';
	import CommonHelper from '$lib/utils/CommonHelper';
	import JsonField from '../records/fields/JsonField.svelte';
	import ai from '$lib/utils/ai';
	import { getJson } from '$lib/utils';
	import { page } from '$app/stores';
	import { pb as ApiClient } from '$lib/pocketbase';
	import QaList from './QAList.svelte';

	let prompt = '';
	let context = '';
	const prompting = writable(false);
	const headers = {
		'Content-Type': 'application/json'
	};

	export let res: AiResponse = {
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

	const request_id = CommonHelper.randomString(8);

	async function fetchKey() {
		try {
			prompting.set(true);

			const input = {
				key: $page.data?.school?.ai_key ?? $page.data?.school?.code ?? 'key',
				urls: $page.url.hostname ?? 'ktechs',
				type: 'school',
				request_id
			};

			const queryString = Object.entries(input)
				.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
				.join('&');

			const url = 'https://www.ktechs.xyz/api/ai?' + queryString;

			const response = await fetch(url);

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const data = await response.json();

			if (data?.success) {
				return data.data;
			} else if (data?.error) {
				console.log(data.error);
				addErrorToast(JSON.stringify(data.error));
			}

			return null;
		} catch (error) {
			console.error('An error occurred:', error);
			addErrorToast(JSON.stringify(error));
			return null;
		} finally {
			prompting.set(false);
		}
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
						{
							...obj,
							answers: CommonHelper.getAnsFromArray(obj.answers)
						}
					];
					qValues = questions.map((val) => {
						return {
							...val,
							answers: CommonHelper.getAnsFromArray(val.answers)
						};
					});
				}
			}
		} catch (error) {}
	};

	let responseText = `
		This is part of response text
		{
		"title": "Bard Knowledge Quiz",
		"totalMarks": 50,
		"questions": []
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
	let questionAiPanel: any;
	let questions = res.questions;
	let isLoading = false;
	export function hide() {
		isLoading = false;
		questions = [];
		return questionAiPanel?.hide();
	}

	type Value = {
		question: string;
		marks: number;
		answers: { correct: boolean; answer: string }[];
	};
	export let value: Value = {
		question: '',
		marks: 1,
		answers: []
	};

	let qValues: any[] = [value];
	onMount(() => {
		showOverlay = true;
		setQs(responseText);
		if (typeof value == 'object' && !Array.isArray(value) && value?.question) {
			res.questions = [value];
		}
	});

	let formView = true;

	export let setAiValues = (
		res: {
			question: string;
			marks: number;
			answers: (string | boolean)[][];
		}[]
	) => {};

	onMount(async () => {
		await ApiClient.collection('ai_queries').subscribe(
			'*',
			(e) => {
				if (e.action == 'create' || e.action == 'update') {
					setQs(e.record?.data);
					addSuccessToast('The ai generated the questions successfully.');
				}
			},
			{
				filter: `request_id = '${request_id}' || request_id = '${$page.url.hostname}'`,
				fields: '*,'
			}
		);
	});
	export let field = { name: '' };

	const getAiQs = async (apiKey: string) => {
		const url =
			'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' +
			apiKey;

		const data = {
			contents: [
				{
					parts: [
						{
							text: prompt
						}
					]
				}
			]
		};
		let responseData: ResponseAi;
		prompting.set(true);

		let query = ai.questions;
		prompt = await cleanString(prompt);
		context = await cleanString(context);
		query = query.replaceAll('<<prompt>>', prompt);
		query = query.replaceAll('<<context>>', context);
		data.contents[0].parts[0].text = query;

		await fetch(url, {
			method: 'POST',
			headers: headers,
			body: JSON.stringify(data)
		})
			.then((response) => {
				if (!response.ok) {
					addErrorToast('Network response was not ok');
					throw new Error('Network response was not ok');
				}
				return response.json();
			})
			.then((jsonData) => {
				// Handle the response data here
				console.log(jsonData);
				responseData = jsonData;
				setQs(responseData.candidates[0].content.parts[0].text);
				prompting.set(false);
			})
			.catch((error) => {
				// Handle errors here
				addErrorToast('There was a problem with the fetch operation:');
				console.error('There was a problem with the fetch operation:', error);
				prompting.set(false);
			});
	};
</script>

{#if field.name == 'question'}
	<div>
		<button class="btn" on:click={() => questionAiPanel.show()} type="button"
			>use AI</button
		>
	</div>
{/if}
{#if showOverlay}
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
		</svelte:fragment>
		<h5>
			After the response scroll down to view your <strong>questions</strong>.
		</h5>

		<JsonField
			isJson={false}
			field={{ name: 'Context or Notes or Url', type: 'text' }}
			bind:value={context}
		/>

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
				/>
				<button
					type="button"
					title="Prompt ai"
					class="btn btn-hint btn-xs"
					on:click={async () => {
						if (!$prompting) {
							const key = await fetchKey(); //.then((val) => console.log(val));
							if (key) {
								getAiQs(key);
							}
						}
					}}
				>
					<i class="ri-message-line" />
					{$prompting ? 'loading...' : 'Send'}
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
			<i class="ri-send-line ri-send" />toggle to {formView ? 'json view' : 'form view'}
		</button>
		{#if !formView}
			<JsonField isJson={false} field={{ name: 'Questions' }} bind:value={qValues} />
		{:else}
			<QaList bind:qValues />
		{/if}

		<svelte:fragment slot="footer">
			<button type="button" class="btn btn-transparent" on:click={() => hide()}>
				<span class="txt">Cancel</span>
			</button>
			<button
				type="button"
				class="btn"
				on:click={() => {
					setAiValues(qValues);
					hide();
				}}
			>
				<span class="txt">Save Questions</span>
			</button>
		</svelte:fragment>
	</OverlayPanel>
{/if}
