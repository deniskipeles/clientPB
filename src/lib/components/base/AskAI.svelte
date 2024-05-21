<script>
	import { onMount } from 'svelte';
	import AutoExpandTextarea from './AutoExpandTextarea.svelte';
	import OverlayPanel from './OverlayPanel.svelte';
	import { writable } from 'svelte/store';
	import { addErrorToast, addSuccessToast } from '$lib/stores/toasts';
	import Field from './Field.svelte';
	import CommonHelper from '$lib/utils/CommonHelper';
	import JsonField from '../records/fields/JsonField.svelte';
	import { page } from '$app/stores';
	const request_id = CommonHelper.randomString(8);

	let showOverlay = false;
	let questionAiPanel;
	
	
	export function hide() {
		return questionAiPanel?.hide();
	}
	
	onMount(() => {
		showOverlay = true;
		loadMarked()
		$input = "Explain for me this record."
	});

	
	export let field = { name: 'AI prompt' };
	export let context = null;
	let context1 = "context1";
	
	$: if(Array.isArray(context) && context?.length>2){
	  context = CommonHelper.transformData(context)
	}else{
	  if(typeof context != "string"){
	    context = JSON.stringify(context)
	  }
	}
	
	import { useCompletion } from 'ai/svelte'
	//$: body = { context: context }; // Reactive statement, updates body when selectedAgent changes
	const storeContext = writable("storeContext")
	const {
		completion,
		complete,
		input,
		isLoading,
		handleSubmit,
		setInput,
	} = useCompletion({
		body:{context,test:"hard string",context1,storeContext:$storeContext},
		onFinish: (prompt, completion) => $input="",
		onError: (error) => console.log(error.message),
	  api:"https://aik-bice.vercel.app/api/completion/google"
	});
	$:if($completion && $isLoading){
	  if(marked) value = marked($completion);
	  if(!marked) value = $completion;
	}
	let marked
	$: value=""
  const loadMarked = () => {
    let script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/marked@12.0.2/lib/marked.umd.min.js";
    document.head.append(script);

    script.onload = () => {
      marked = window.marked.marked;
      console.log("marked loaded");
      
      if(marked){
        try{
          value=marked(value)
        }catch(err){
          console.log(err)
        }
      }
    };
  };
  let viewContext=false
</script>


<div>
		<button class="btn" on:click={() => questionAiPanel.show()} type="button"
			>ask AI</button
		>
</div>

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
	  
	  
		{#if viewContext}
		<input bind:value={context1}/>
		<input bind:value={$storeContext}/>
		<Field class="form-field" name={'context'} let:uniqueId>
			<label for={uniqueId}>
				<i class={CommonHelper.getFieldTypeIcon('text')} />
				<span class="txt">Context or Notes</span>
			</label>
			<div class="flex">
				<AutoExpandTextarea
					id={uniqueId}
					required={false}
					bind:value={context}
					placeholder=""
				/>
			</div>
		</Field>
		{/if}
		<button
			type="button"
			title="Prompt ai"
			class="btn btn-hint btn-xs"
			on:click={() => (viewContext = !viewContext)}
		>
			<i class="ri-send-line ri-send" />{viewContext ? 'hide context' : 'view context'}
		</button>
		<Field class="form-field" name={'answer'} let:uniqueId>
			<label for={uniqueId}>
				<i class={CommonHelper.getFieldTypeIcon('text')} />
				<span class="txt">Your Prompt</span>
			</label>
			<div class="flex">
				<AutoExpandTextarea
					id={uniqueId}
					required={true}
					bind:value={$input}
					placeholder="Enter your prompt here"
				/>
				<button
					type="button"
					title="Prompt ai"
					class="btn btn-hint btn-xs"
					on:click={()=>complete($input,{body:{context}})}
				>
					<i class="ri-message-line" />
					{$isLoading ? 'loading...' : 'Send'}
				</button>
			</div>
		</Field>
		
		<div class="m-2">
		  {@html value}
		</div>

		<svelte:fragment slot="footer">
			<button type="button" class="btn btn-transparent" on:click={() => hide()}>
				<span class="txt">Cancel</span>
			</button>
		</svelte:fragment>
	</OverlayPanel>
{/if}
