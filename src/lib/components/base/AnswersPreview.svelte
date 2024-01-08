<script lang="ts">
	import { QUESTION_CONSTANT } from '$lib/utils/CONSTANTS';
	import CommonHelper from '$lib/utils/CommonHelper';

	export let answers = QUESTION_CONSTANT.answers;
	$: if(answers.length){
		answers = CommonHelper.getAnsFromArray(answers);
	}
	
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
