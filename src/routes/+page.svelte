<script>
	import { page } from '$app/stores';
	import TinyMce from '$lib/components/base/TinyMCE.svelte';
	import { P } from 'flowbite-svelte';
	import { html_data } from '$lib/stores/app';

	$: app = $page.data?.app ?? {html_data};
	$:if(!app.html_data || app.html_data==""){
	  app.html_data=html_data
	}
</script>

<svelte:head>
	<title>{app?.data?.title ?? app?.data?.name ?? 'ClientPB'}</title>
	<meta name="description" content={app?.data?.decription ?? 'ClientPB for user interaction with pocketbase'} />
</svelte:head>
<div class="pt-20">
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
		value={app?.html_data ?? html_data}
		disabled
	/>
</div>
