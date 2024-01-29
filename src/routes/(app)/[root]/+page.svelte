<script>
	import { page } from '$app/stores';
	import TinyMce from '$lib/components/base/TinyMCE.svelte';
	import { P } from 'flowbite-svelte';

	$: home_page = $page.data?.roots?.find((i) => i?.name?.includes('home page')) ?? {};
	$: root_page = $page.data?.roots?.find((i) => i?.id?.includes($page?.url?.params?.root)) ?? {};
	$: school = $page.data?.roots?.find((i) => i?.name?.includes('school')) ?? {};
</script>

<svelte:head>
	<title>{root_page?.data?.name ?? 'Prime School'}</title>
	<meta name="description" content={root_page?.data?.decription ?? 'Prime School Online Resources'} />
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
		value={root_page?.html_data ?? home_page?.html_data}
		disabled
	/>
</div>
