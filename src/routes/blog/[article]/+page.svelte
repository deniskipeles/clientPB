<script>
	import { page } from '$app/stores';
	import TinyMce from '$lib/components/base/TinyMCE.svelte';
	import { P } from 'flowbite-svelte';
	import { html_data } from '$lib/stores/app';

	$: app = $page.data?.app ?? {};
  export let data;
</script>

<svelte:head>
	<title>{data?.article?.title ?? 'Article'}</title>
	<meta name="description" content={data?.article?.content ?? 'Article content'} />
</svelte:head>
<div class="pt-20">
	<h4 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{data?.article?.title}</h4>
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
		value={data?.article?.content ?? app?.html_data ?? html_data}
		disabled
	/>
</div>
