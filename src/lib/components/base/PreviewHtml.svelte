<script>
  import CommonHelper from "$lib/utils/CommonHelper";
  import { processHTMLString,loadMarked } from "$lib/utils/latexProcessor";
  import tooltip from '$lib/actions/tooltip';
  import { Printer, CloudArrowDown } from 'svelte-heros-v2';
  import { printFxn, genPDF } from '$lib/utils';
  import Iframe from '$lib/components/base/Iframe.svelte';
  import { onMount } from 'svelte'
  
  let mounted = false;
  onMount(()=>mounted=true);

  export let markdown;
  $: if (markdown && mounted) {
    markdown = processHTMLString(markdown);
  }

  const uniqueDivId = `print-${CommonHelper.randomString(7)}`;

  let generating = false;
  let printingPDF = false;

  const genPDF_fxn = async () => {
    let value_ = loadMarked(markdown)
    value_ = processHTMLString(value_)
    await genPDF('https://aiwebapp-rwci.onrender.com/', value_, (options) => {
      generating = options.generating;
      // file = options.file;
    });
  };
  
  let printHtml = ""
  const handleHtmlUpdated = ({ detail: { id, html } }) => {
    if (id === 'print' && html) {
      printHtml = html;
    }
  };
</script>


{#if mounted}
<div id={uniqueDivId+"-"}>
  <Iframe {markdown} id="print" on:html-updated={handleHtmlUpdated} />
</div>

<div class="flex">
  <button
    type="button"
    class="btn btn-transparent"
    on:click={genPDF_fxn}
  >
    <span class={`txt ${generating ? 'animate-ping' : ''}`}>
      <CloudArrowDown /> {'pdf'}
    </span>
  </button>
  |
  <button
    use:tooltip={`Click here to download or print what you see in this table in pdf format.`}
    class={`btn btn-transparent ${printingPDF ? 'animate-ping' : ''}`}
    on:click={() => {
      printFxn(uniqueDivId, uniqueDivId, printHtml);
    }}
  >
    <span class="txt">
      <Printer /> {'print'}
    </span>
  </button>
</div>
{/if}