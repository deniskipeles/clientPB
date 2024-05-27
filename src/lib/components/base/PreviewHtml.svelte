<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import CommonHelper from "$lib/utils/CommonHelper";
	import LatexImage from "$lib/components/base/LatexImage.svelte";
	import tooltip from '$lib/actions/tooltip';
	
	
	
	
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
        //tex: {inlineMath: [['$', '$'], ['\\(', '\\)']]},
        svg: {fontCache: 'global'}
      };
		};
		console.log("mathjax loaded")
	}
	
	import { Printer, CloudArrowDown } from 'svelte-heros-v2';
  import { printFxn,genPDF } from '$lib/utils';
  const uniqueDivId = "print" + CommonHelper.randomString(7);
  
  $: generating = false
  let printingPDF = false;
  
  const genPDF_fxn = async()=> await genPDF('https://aiwebapp-rwci.onrender.com/',markdown,(options)=>{
    generating=options.generating;
    // file=options.file;
  })
</script>

  <div id={uniqueDivId} class="tinymce-wrapper">
<div id="preview" class="remove-all">
    {#key markdown}
  		{@html markdown}
  	{/key}
</div>
  ============initial
<div id="preview" class="no-tailwind">
    {#key markdown}
  		{@html markdown}
  	{/key}
</div>
  ============unset
<div id="preview" class="no-tailwind2">
    {#key markdown}
  		{@html markdown}
  	{/key}
</div>
  ============unset
  </div>
<!--LatexImage/-->

<div class="flex">
	<button type="button" class="btn btn-transparent" on:click={genPDF_fxn}>
		<span class="txt {generating ? 'animate-ping' : ''}">
		  <CloudArrowDown /> {'pdf'}
		</span>
	</button>|
  <button
      use:tooltip={`Click here to download or print what you see in this table in pdf format.`}
      class={`btn btn-transparent ${printingPDF ? 'animate-ping' : ''}`}
      on:click={() => {
          printFxn(uniqueDivId);
      }}
  >
    <span class="txt">
      <Printer />{'print'}
    </span>
  </button>
</div>



<style>
  .no-tailwind {
      all: initial;
  }
  .no-tailwind2 {
      all: unset;
  }


  /* General reset for all elements inside the preview */
  #preview, #preview * {
    all: initial;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    color: inherit;
    background: none;
    border: none;
    text-decoration: none;
  }

  /* Apply default styles for common elements */
  #preview {
    font-family: Arial, sans-serif;
    font-size: 14pt;
    line-height: 1.6;
    color: #333;
    padding: 20px;
    border: 1px solid #ddd;
    background-color: #f9f9f9;
    overflow: auto;
  }

  #preview h1, #preview h2, #preview h3, #preview h4, #preview h5, #preview h6 {
    font-weight: bold;
    margin-top: 1em;
    margin-bottom: 0.5em;
  }

  #preview h1 {
    font-size: 2em;
  }
  #preview h2 {
    font-size: 1.5em;
  }
  #preview h3 {
    font-size: 1.17em;
  }
  #preview h4 {
    font-size: 1em;
  }
  #preview h5 {
    font-size: 0.83em;
  }
  #preview h6 {
    font-size: 0.67em;
  }

  #preview p {
    margin: 0 0 1em 0;
  }

  #preview a {
    color: #0066cc;
    text-decoration: underline;
  }

  #preview ul, #preview ol {
    margin: 0 0 1em 1.5em;
    padding-left: 40px; /* Ensure default padding for lists */
  }

  #preview ul {
    list-style-type: disc;
  }

  #preview ol {
    list-style-type: decimal;
  }

  #preview li {
    margin-bottom: 0.5em;
  }

  #preview table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1em;
  }

  #preview th, #preview td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }

  #preview th {
    background-color: #f2f2f2;
  }

  #preview img {
    max-width: 100%;
    height: auto;
  }

  #preview code {
    font-family: "Courier New", Courier, monospace;
    background-color: #f5f5f5;
    padding: 2px 4px;
    border-radius: 4px;
  }

  #preview strong, #preview b {
    font-weight: bolder;
  }
</style>


