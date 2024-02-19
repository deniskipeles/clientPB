<script>
	import { page } from '$app/stores';
	import TinyMce from '$lib/components/base/TinyMCE.svelte';
	import { P } from 'flowbite-svelte';

	$: home_page = $page.data?.roots?.find((i) => i?.name?.includes('home page')) ?? {};
	$: school = $page.data?.roots?.find((i) => i?.name?.includes('school')) ?? {};
</script>

<svelte:head>
	<title>{school?.data?.name ?? 'Prime School'}</title>
	<meta name="description" content={school?.data?.decription ?? 'Prime School Online Resources'} />
</svelte:head>
<div class="pt-20">
	<P class="px-6 py-2">
    {@html "The title of article"}
	</P>
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
		value={home_page?.html_data}
		disabled
	/>
</div>
