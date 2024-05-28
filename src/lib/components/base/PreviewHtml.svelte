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
		try{iframeFxn()}catch(e){console.log(e)}
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
  export let scriptSources = [
    "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"
    ]; // Array of script URLs to inject

  let iframe;
  const iframeFxn=() => {
    const doc = iframe.contentDocument;
    const head = doc.head;
    const body = doc.body;

    // Inject styles
    const style = doc.createElement('style');
    style.textContent = `
    /* General Styles */
body {
    font-family: Arial, sans-serif;
    font-size: 12pt;
    line-height: 1.5;
    color: #000;
}
/* Page Settings */
@page {
    size: A4; /* or use letter for US letter size */
    margin: 1in;
}
/* Margins for the body */
body {
    margin: 0;
    padding: 1in;
}
/* Headers and Footers */
header, footer {
    position: fixed;
    left: 0;
    right: 0;
    color: #555;
    text-align: center;
}
header {
    top: 0;
}
footer {
    bottom: 0;
    font-size: 10pt;
}
/* Page Numbering */
footer::after {
    content: "Page " counter(page) " of " counter(pages);
}
/* Headings */
h1, h2, h3, h4, h5, h6 {
    page-break-after: avoid;
}
/* Prevent page break within elements */
p, blockquote, pre, table, figure {
    page-break-inside: avoid;
}
/* Tables */
table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1em;
}
th, td {
    border: 1px solid #000;
    padding: 0.5em;
    text-align: left;
}
th {
    background-color: #f2f2f2;
}
/* Images */
img {
    max-width: 100%;
    height: auto;
}
/* Links */
a {
    color: #000;
    text-decoration: none;
}
a:visited {
    color: #000;
}
/* Lists */
ul, ol {
    margin: 0 0 1em 1em;
}
/* Code blocks */
pre, code {
    font-family: "Courier New", Courier, monospace;
    font-size: 10pt;
}
/* Avoid breaking code blocks */
pre {
    page-break-inside: avoid;
}
/* Remove styles not needed for print */
@media print {
    nav, aside, .no-print {
        display: none;
    }
}
    `
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
  }
  
</script>


<style>
    iframe { width: 100%; height:1000px}
</style>


<iframe
  title="Article"
  id='microapp-{uniqueDivId}'
  frameborder='0'
  bind:this={iframe}
></iframe>

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


