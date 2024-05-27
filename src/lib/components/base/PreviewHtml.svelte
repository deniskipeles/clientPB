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
<div id="preview" class="initials-all no-tailwind2">
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
  
  .initials-all {
  align-content: stretch;
  align-items: stretch;
  align-self: auto;
  animation-delay: 0s;
  animation-direction: normal;
  animation-duration: 0s;
  animation-fill-mode: none;
  animation-iteration-count: 1;
  animation-name: none;
  animation-play-state: running;
  animation-timing-function: ease;
  azimuth: center;
  backface-visibility: visible;
  background-attachment: scroll;
  background-blend-mode: normal;
  background-clip: border-box;
  background-color: transparent;
  background-image: none;
  background-origin: padding-box;
  background-position: 0% 0%;
  background-repeat: repeat;
  background-size: auto auto;
  block-size: auto;
  border-block-end-color: currentcolor;
  border-block-end-style: none;
  border-block-end-width: medium;
  border-block-start-color: currentcolor;
  border-block-start-style: none;
  border-block-start-width: medium;
  border-bottom-color: currentcolor;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-bottom-style: none;
  border-bottom-width: medium;
  border-collapse: separate;
  border-image-outset: 0s;
  border-image-repeat: stretch;
  border-image-slice: 100%;
  border-image-source: none;
  border-image-width: 1;
  border-inline-end-color: currentcolor;
  border-inline-end-style: none;
  border-inline-end-width: medium;
  border-inline-start-color: currentcolor;
  border-inline-start-style: none;
  border-inline-start-width: medium;
  border-left-color: currentcolor;
  border-left-style: none;
  border-left-width: medium;
  border-right-color: currentcolor;
  border-right-style: none;
  border-right-width: medium;
  border-spacing: 0;
  border-top-color: currentcolor;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-top-style: none;
  border-top-width: medium;
  bottom: auto;
  box-decoration-break: slice;
  box-shadow: none;
  box-sizing: content-box;
  break-after: auto;
  break-before: auto;
  break-inside: auto;
  caption-side: top;
  caret-color: auto;
  clear: none;
  clip: auto;
  clip-path: none;
  color: initial;
  column-count: auto;
  column-fill: balance;
  column-gap: normal;
  column-rule-color: currentcolor;
  column-rule-style: none;
  column-rule-width: medium;
  column-span: none;
  column-width: auto;
  content: normal;
  counter-increment: none;
  counter-reset: none;
  cursor: auto;
  display: inline;
  empty-cells: show;
  filter: none;
  flex-basis: auto;
  flex-direction: row;
  flex-grow: 0;
  flex-shrink: 1;
  flex-wrap: nowrap;
  float: none;
  font-family: initial;
  font-feature-settings: normal;
  font-kerning: auto;
  font-language-override: normal;
  font-size: medium;
  font-size-adjust: none;
  font-stretch: normal;
  font-style: normal;
  font-synthesis: weight style;
  font-variant: normal;
  font-variant-alternates: normal;
  font-variant-caps: normal;
  font-variant-east-asian: normal;
  font-variant-ligatures: normal;
  font-variant-numeric: normal;
  font-variant-position: normal;
  font-weight: normal;
  grid-auto-columns: auto;
  grid-auto-flow: row;
  grid-auto-rows: auto;
  grid-column-end: auto;
  grid-column-gap: 0;
  grid-column-start: auto;
  grid-row-end: auto;
  grid-row-gap: 0;
  grid-row-start: auto;
  grid-template-areas: none;
  grid-template-columns: none;
  grid-template-rows: none;
  height: auto;
  hyphens: manual;
  image-orientation: 0deg;
  image-rendering: auto;
  image-resolution: 1dppx;
  ime-mode: auto;
  inline-size: auto;
  isolation: auto;
  justify-content: flex-start;
  left: auto;
  letter-spacing: normal;
  line-break: auto;
  line-height: normal;
  list-style-image: none;
  list-style-position: outside;
  list-style-type: disc;
  margin-block-end: 0;
  margin-block-start: 0;
  margin-bottom: 0;
  margin-inline-end: 0;
  margin-inline-start: 0;
  margin-left: 0;
  margin-right: 0;
  margin-top: 0;
  mask-clip: border-box;
  mask-composite: add;
  mask-image: none;
  mask-mode: match-source;
  mask-origin: border-box;
  mask-position: 0% 0%;
  mask-repeat: repeat;
  mask-size: auto;
  mask-type: luminance;
  max-height: none;
  max-width: none;
  min-block-size: 0;
  min-height: 0;
  min-inline-size: 0;
  min-width: 0;
  mix-blend-mode: normal;
  object-fit: fill;
  object-position: 50% 50%;
  offset-block-end: auto;
  offset-block-start: auto;
  offset-inline-end: auto;
  offset-inline-start: auto;
  opacity: 1.0;
  order: 0;
  orphans: 2;
  outline-color: initial;
  outline-offset: 0;
  outline-style: none;
  outline-width: medium;
  overflow: visible;
  overflow-wrap: normal;
  overflow-x: visible;
  overflow-y: visible;
  padding-block-end: 0;
  padding-block-start: 0;
  padding-bottom: 0;
  padding-inline-end: 0;
  padding-inline-start: 0;
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
  page-break-after: auto;
  page-break-before: auto;
  page-break-inside: auto;
  perspective: none;
  perspective-origin: 50% 50%;
  pointer-events: auto;
  position: static;
  quotes: initial;
  resize: none;
  right: auto;
  ruby-align: space-around;
  ruby-merge: separate;
  ruby-position: over;
  scroll-behavior: auto;
  scroll-snap-coordinate: none;
  scroll-snap-destination: 0px 0px;
  scroll-snap-points-x: none;
  scroll-snap-points-y: none;
  scroll-snap-type: none;
  shape-image-threshold: 0.0;
  shape-margin: 0;
  shape-outside: none;
  tab-size: 8;
  table-layout: auto;
  text-align: initial;
  text-align-last: auto;
  text-combine-upright: none;
  text-decoration-color: currentcolor;
  text-decoration-line: none;
  text-decoration-style: solid;
  text-emphasis-color: currentcolor;
  text-emphasis-position: over right;
  text-emphasis-style: none;
  text-indent: 0;
  text-justify: auto;
  text-orientation: mixed;
  text-overflow: clip;
  text-rendering: auto;
  text-shadow: none;
  text-transform: none;
  text-underline-position: auto;
  top: auto;
  touch-action: auto;
  transform: none;
  transform-box: border-box ;
  transform-origin: 50% 50% 0;
  transform-style: flat;
  transition-delay: 0s;
  transition-duration: 0s;
  transition-property: all;
  transition-timing-function: ease;
  vertical-align: baseline;
  visibility: visible;
  white-space: normal;
  widows: 2;
  width: auto;
  will-change: auto;
  word-break: normal;
  word-spacing: normal;
  word-wrap: normal;
  writing-mode: horizontal-tb;
  z-index: auto;
  -webkit-appearance: none;
  -moz-appearance: none;
  -ms-appearance: none;
  appearance: none;
 }
 
</style>


