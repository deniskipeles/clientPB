<script>
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import CommonHelper from "$lib/utils/CommonHelper";
  import { processHTMLString } from "$lib/utils/latexProcessor";
  import tooltip from '$lib/actions/tooltip';

  export let markdown;
  export let id = `iframe-${CommonHelper.randomString(7)}`;
  export let scriptSources = [
    'https://i.upmath.me/latex.js',
    'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js',
    'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs'
  ];

  let marked;
  const dispatch = createEventDispatcher();

  $: if (markdown) {
    markdown = processHTMLString(markdown);
    if (marked) markdown = marked.parse(markdown);
    if (iframe?.contentDocument?.body?.innerHTML) {
      iframe.contentDocument.body.innerHTML = marked ? marked.parse(markdown) : markdown;
      typesetMath();
      dispatch('html-updated', { id, html: iframe.contentDocument.body.innerHTML });
    }
  }

  onMount(() => {
    loadMarked();
    window.addEventListener('message', handleMessage);
    dispatch('html-updated', { id, html: iframe.contentDocument.body.innerHTML });
  });

  onDestroy(() => {
    window.removeEventListener('message', handleMessage);
  });

  const loadMarked = () => {
    if (!window.marked) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/marked@12.0.2/lib/marked.umd.min.js';
      document.head.append(script);

      script.onload = () => {
        marked = window.marked.marked;
        console.log('marked loaded');
        iframeFxn();
      };
    } else {
      marked = window.marked.marked;
      iframeFxn();
    }
  };

  const uniqueDivId = `print${CommonHelper.randomString(7)}`;
  export let iframe;
  let loadingFrame = true;

  $: if (iframe && markdown) {
    iframeFxn();
  }

  const iframeFxn = () => {
    const doc = iframe.contentDocument;
    const head = doc.head;
    const body = doc.body;

    // Inject styles
    const style = doc.createElement('style');
    style.textContent = `
      /* General Styles */
      body {
        font-family: Arial, sans-serif;
        font-size: 10pt;
        line-height: 1.5;
        color: #000;
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
        color: #418df3;
        text-decoration: none;
      }
      a:visited {
        color: #3e44e8;
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
    `;
    head.appendChild(style);

    // Inject content
    body.innerHTML = marked ? marked.parse(markdown) : markdown;

    // Inject scripts
    scriptSources.forEach((src) => {
      const script = doc.createElement('script');
      script.src = src;
      head.appendChild(script);
    });
    loadingFrame = false;
  };

  const typesetMath = () => {
    const doc = iframe.contentDocument;
    const mathElements = doc.querySelectorAll('script[type="math/tex"]');

    mathElements.forEach((mathElement, index) => {
      const tex = mathElement.textContent;
      const chtml = window.MathJax.typesetPromise({
        math: tex,
        format: 'tex',
        svg: false,
        display: mathElement.parentNode.tagName === 'P'
      }).then((typeset) => {
        const html = typeset.html;
        mathElement.parentNode.insertAdjacentHTML('beforeend', html);
        mathElement.parentNode.removeChild(mathElement);

        if (index === mathElements.length - 1) {
          dispatch('html-updated', { id, html: iframe.contentDocument.body.innerHTML });
        }
      });
    });
  };
  
  const handleMessage = (event) => {
    if (event.data === 'print-ready') {
      dispatch('print-ready', { id });
    }
  };
</script>

<style>
  iframe {
    width: 100%;
    height: 1000px;
  }
</style>

<iframe
  title="Article"
  id={`microapp-${uniqueDivId}`}
  frameborder="0"
  bind:this={iframe}
></iframe>
