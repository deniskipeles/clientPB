<script>
	import { QUESTION_CONSTANT } from '$lib/utils/CONSTANTS';

	export let answers = QUESTION_CONSTANT.answers;
</script>

{#each answers as answer}
	<p>
		{#if answer?.correct}
			<i class="ri-checkbox-circle-fill txt-success" />
		{:else}
			<i class="ri-close-circle-fill txt-danger" />
		{/if}{answer?.answer}
	</p>
{/each}
