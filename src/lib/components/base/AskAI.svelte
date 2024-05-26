<script>
	import { onMount } from 'svelte';
	import AutoExpandTextarea from './AutoExpandTextarea.svelte';
	import OverlayPanel from './OverlayPanel.svelte';
	
	import { addErrorToast, addSuccessToast } from '$lib/stores/toasts';
	import Field from './Field.svelte';
	import CommonHelper from '$lib/utils/CommonHelper';
	import {arrayToCsv} from '$lib/utils/json_to_csv';
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
	export let contextFxn=null;
	
	
	$: if(Array.isArray(context) && context?.length>2){
	  context = JSON.stringify(context)
	}else{
	  if(typeof context != "string"){
	    context = JSON.stringify(context)
	  }
	}
	
	import { useCompletion } from 'ai/svelte'
	
	const {
		completion,
		complete,
		input,
		isLoading,
		handleSubmit,
		setInput,
	} = useCompletion({
		body:{context},
		onFinish: (prompt, completion) => $input="",
		onError: (error) => console.log(error.message),
	  api:"https://aik-bice.vercel.app/api/completion/schools"
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
  
  import { Printer, CloudArrowDown } from 'svelte-heros-v2';
  import { printFxn,genPDF } from '$lib/utils';
  const uniqueDivId = "print" + CommonHelper.randomString(7);
  
  $: generating = false
  const genPDF_fxn = async()=> await genPDF('https://aiwebapp-rwci.onrender.com/',value,(options)=>{
    generating=options.generating;
    // file=options.file;
  })
</script>


<div>
		<button class="btn" on:click={() =>{
		  if(contextFxn){
  	    context=contextFxn()
  	  }
		  return questionAiPanel.show()
		}} type="button"
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
					on:input={(e)=>{}}
					required={true}
					bind:value={$input}
					placeholder="Enter your prompt here"
				/>
				<button
					type="button"
					title="Prompt ai"
					class="btn btn-hint btn-xs"
					on:click={()=>{
					  return complete($input,{body:{context}})
					}}
				>
					<i class="ri-message-line" />
					{$isLoading ? 'loading...' : 'Send'}
				</button>
			</div>
		</Field>
		
		<div id={uniqueDivId} class="m-2 overflow-content">
		  {@html value}
		</div>

		<svelte:fragment slot="footer">
		  <button type="button" class="btn btn-transparent" on:click={genPDF_fxn}>
				<span class="txt {generating ? 'animate-ping' : ''}">
				  <CloudArrowDown /> {'pdf'}
				</span>
			</button>|
			<button type="button" class="btn btn-transparent" on:click={() => printFxn(uniqueDivId)}>
				<span class="txt">
				  <Printer />{'print'}
				</span>
			</button>
			<button type="button" class="btn btn-transparent" on:click={() => hide()}>
				<span class="txt">Cancel</span>
			</button>
		</svelte:fragment>
	</OverlayPanel>
{/if}


<style>
.overflow-content {
    width: 100%; /* or any other fixed width */
    overflow-x: auto;
}
</style>