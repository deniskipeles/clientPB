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
        tex: {inlineMath: [['$', '$'], ['\\(', '\\)']]},
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




  

  export let content = "";
  export let scriptSources = ["https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"]; // Array of script URLs to inject
  let st=`
      :host {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        padding: 20px;
        border: 1px solid #ddd;
        background-color: #f9f9f9;
        display: block;
        width: 100%;
      }
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        padding: 20px;
        border: 1px solid #ddd;
        background-color: #f9f9f9;
        display: block;
        width: 100%;
      }

      h1, h2, h3, h4, h5, h6 {
        font-weight: bold;
        margin-top: 1em;
        margin-bottom: 0.5em;
      }

      h1 { font-size: 2em; }
      h2 { font-size: 1.5em; }
      h3 { font-size: 1.17em; }
      h4 { font-size: 1em; }
      h5 { font-size: 0.83em; }
      h6 { font-size: 0.67em; }

      p {
        margin: 0 0 1em 0;
      }

      a {
        color: #0066cc;
        text-decoration: underline;
      }

      ul, ol {
        margin: 0 0 1em 1.5em;
        padding-left: 40px;
      }

      ul {
        list-style-type: disc;
      }

      ol {
        list-style-type: decimal;
      }

      li {
        margin-bottom: 0.5em;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 1em;
      }

      th, td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
      }

      th {
        background-color: #f2f2f2;
      }

      img {
        max-width: 100%;
        height: auto;
      }

      code {
        font-family: "Courier New", Courier, monospace;
        background-color: #f5f5f5;
        padding: 2px 4px;
        border-radius: 4px;
      }

      strong, b {
        font-weight: bolder;
      }
    `;

  let iframe;

  onMount(() => {
    const doc = iframe.contentDocument;
    const head = doc.head;
    const body = doc.body;

    // Inject styles
    const style = doc.createElement('style');
    style.textContent = st
    head.appendChild(style);
    body.appendChild(style);

    // Inject content
    body.innerHTML = marked?marked.parse(markdown):markdown;

    // Inject scripts
    scriptSources.forEach(src => {
      const script = doc.createElement('script');
      script.src = src;
      head.appendChild(script);
    });
  });






  let shadowRoot;

  onMount(() => {
    const previewElement = document.getElementById('preview-shadow');
    shadowRoot = previewElement.attachShadow({ mode: 'open' });

    // Inject styles
    const style = document.createElement('style');
    style.textContent = st
    shadowRoot.appendChild(style);

    // Inject content
    const contentDiv = document.createElement('div');
    contentDiv.innerHTML = marked ? marked.parse(markdown) : markdown;
    shadowRoot.appendChild(contentDiv);

    // Inject scripts
    scriptSources.forEach(src => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        // You can execute additional script logic here if needed
      };
      document.body.appendChild(script);
    });
  });
</script>







<style>
  #preview-shadow {
    width: 100%;
    height: 100%;
  }
</style>

<div id="preview-shadow"></div>


<iframe bind:this={iframe} style="width: 100%; height: 1000px; border: none;"></iframe>


  <!--div id={uniqueDivId} class="tinymce-wrapper">
<div id="preview" class="remove-all">
    {#key markdown}
  		{@html markdown}
  	{/key}
</div>
  </div-->

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
          printFxn(uniqueDivId,uniqueDivId,markdown);
      }}
  >
    <span class="txt">
      <Printer />{'print'}
    </span>
  </button>
</div>


