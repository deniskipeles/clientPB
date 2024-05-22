<script>
	import { page } from '$app/stores';
	import TinyMce from '$lib/components/base/TinyMCE.svelte';
	import { P } from 'flowbite-svelte';
	import { html_data } from '$lib/stores/app';
	import PreviewHtml from "$lib/components/base/PreviewHtml.svelte";

  export let data;
	$: inline = false;
	$: app = $page.data?.app ?? {};
	$: value = data?.article?.content ?? app?.html_data ?? html_data;
  
  function countLatexExpressions(htmlString) {
      const latexRegex = /\$\$(.*?)\$\$/gms; // match $$latex code$$
      const latexRegexAlt = /\\\[(.*?)\\\]/gms; // match \[latex code\]
      const latexRegexSingle = /(?<!\\)\$(?!\\)(.*?)\$/gms; // match $latex code$
      const latexRegexEscaped = /\\\((.*?)\\\)/gms; // match \(latex code\)
      let count = 0;
      // Count matches of the first regular expression
      let match;
      while ((match = latexRegex.exec(htmlString)) !== null) {
        count++;
      }
      // Count matches of the second regular expression
      match = null;
      while ((match = latexRegexAlt.exec(htmlString)) !== null) {
        count++;
      }
      // Count matches of the third regular expression
      match = null;
      while ((match = latexRegexSingle.exec(htmlString)) !== null) {
        count++;
      }
      // Count matches of the fourth regular expression
      match = null;
      while ((match = latexRegexEscaped.exec(htmlString)) !== null) {
        count++;
      }
      return count;
    }
    let c=countLatexExpressions(value)
    $: if(value && c>0){
      inline=true
    }
</script>

<svelte:head>
	<title>{data?.article?.title ?? 'Article'}</title>
	<meta name="description" content={data?.article?.content ?? 'Article content'} />
</svelte:head>
<div class="pt-20">
	<h4 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{data?.article?.title}</h4>
	{#if !inline}
	<TinyMce
		cssClass="tinymce-preview custom-scrollbar"
		conf={{
			branding: false,
			promotion: false,
			menubar: false,
			statusbar: false,
			min_height: 10,
			height: 59,
			max_height: 1000,
			autoresize_bottom_margin: 5,
			resize: false,
			content_style: 'body { font-size: 14px }',
			toolbar: '',
			plugins: ['autoresize']
		}}
		{value}
		disabled
	/>
	{:else}
	  <PreviewHtml markdown={value} />
	{/if}
</div>
