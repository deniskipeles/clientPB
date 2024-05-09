<script>
	import { page } from '$app/stores';
	import TinyMce from '$lib/components/base/TinyMCE.svelte';
	import { P } from 'flowbite-svelte';
	import { html_data } from '$lib/stores/app';

	$: app = $page.data?.app ?? {};
	$:if(!app.html_data || app.html_data==""){
	  app.html_data=html_data
	}
	$: about_page = $page.data?.roots?.find((i) => i?.name?.includes('about-page')) ?? {};
</script>

<svelte:head>
	<title>{about_page?.data?.name ?? 'about clientPB page'}</title>
	<meta name="description" content={about_page?.data?.decription ?? 'this is clientPB about page'} />
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
		value={about_page?.html_data ?? app?.html_data ?? html_data}
		disabled
	/>
</div>
