<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import CommonHelper from "$lib/utils/CommonHelper";
	import { Printer } from 'svelte-heros-v2';
	import tooltip from '$lib/actions/tooltip';
	import { printFxn } from '$lib/utils';
	let printingPDF = false;
	
	
	export let markdown;
	export let id = "tinymce_svelte" + CommonHelper.randomString(7);
	
	let marked;
	const dispatch = createEventDispatcher();

	$: if (markdown) {
		if(marked)markdown = marked.parse(markdown);
	}
	
	onMount(()=>{
		loadMarked()
		loadMathjax()
	})
	const loadMarked = () => {
	  if(!window.marked){
  		let script = document.createElement('script');
      script.src = "https://cdn.jsdelivr.net/npm/marked@12.0.2/lib/marked.umd.min.js";
      document.head.append(script);
  		
  		script.onload = () => {
        marked = window.marked.marked
  			console.log("marked loaded")
  		};
	  }else{
        marked = window.marked.marked
	  }
	}
	const loadMathjax = () => {
		let script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js";
    document.head.append(script);
		
		script.onload = () => {
      MathJax = {
        tex: {inlineMath: [['$', '$'], ['\\(', '\\)']]},
        svg: {fontCache: 'global'}
      };
		};
		console.log("mathjax loaded")
	}
</script>


<div id="printable" class="tinymce-wrapper">
    {#key markdown}
		 {@html markdown}
		{/key}
</div>

<button
    use:tooltip={`Click here to download or print what you see in this table in pdf format.`}
    class={`flex ${printingPDF ? 'animate-ping' : ''}`}
    on:click={() => {
        printFxn('printable');
    }}
>
    <Printer />{'print'}
</button>
	