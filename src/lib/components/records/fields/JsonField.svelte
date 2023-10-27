<script>
	import { onMount } from 'svelte';
	import tooltip from '$lib/actions/tooltip';
	import CommonHelper from '$lib/utils/CommonHelper';
	import Field from '$lib/components/base/Field.svelte';
	import { QUESTION_CONSTANT } from '$lib/utils/CONSTANTS';
	import QuestionForm from './QuestionForm.svelte';

	export let field;
	export let value = undefined;

	let editorComponent;

	let serialized = serialize(value ?? (field.name == 'question' ? QUESTION_CONSTANT : {}));

	$: if (value !== serialized?.trim()) {
		serialized = serialize(value ?? (field.name == 'question' ? QUESTION_CONSTANT : {}));
		value = serialized;
	}

	$: isValid = isValidJson(serialized);

	function serialize(val) {
		return JSON.stringify(typeof val === 'undefined' ? null : val, null, 2);
	}

	function isValidJson(val) {
		try {
			JSON.parse(val === '' ? null : val);
			return true;
		} catch (_) {}

		return false;
	}

	onMount(async () => {
		try {
			editorComponent = (await import('$lib/components/base/CodeEditor.svelte')).default;
		} catch (err) {
			console.warn(err);
		}
	});
</script>

<Field class="form-field {field.required ? 'required' : ''}" name={field.name} let:uniqueId>
	<label for={uniqueId}>
		<i class={CommonHelper.getFieldTypeIcon(field.type)} />
		<span class="txt">{field.name}</span>
		<span class="txt">
			<QuestionForm
				{value}
                {field}
				setJson={(inValue) => {
					if (typeof inValue == 'object') {
						try {
							value = inValue;
						} catch (error) {
							console.log(error);
						}
					}
				}}
			/>
		</span>
		<span
			class="json-state"
			use:tooltip={{ position: 'left', text: isValid ? 'Valid JSON' : 'Invalid JSON' }}
		>
			{#if isValid}
				<i class="ri-checkbox-circle-fill txt-success" />
			{:else}
				<i class="ri-error-warning-fill txt-danger" />
			{/if}
		</span>
	</label>
	{#if editorComponent}
		<svelte:component
			this={editorComponent}
			id={uniqueId}
			maxHeight="500"
			language="json"
			value={serialized}
			on:change={(e) => {
				serialized = e.detail;
				value = serialized.trim();
			}}
		/>
	{:else}
		<input type="text" class="txt-mono" value="Loading..." disabled />
	{/if}
</Field>

<style>
	.json-state {
		position: absolute;
		right: 10px;
	}
</style>
