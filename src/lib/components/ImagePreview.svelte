<script lang="ts">
	import { getPbImageUrl } from '$lib/utils';
	// export let isOpen: any;
	export let item: Item;
	export let value: any;
	export let size: "xs" | "sm" | "lg" | "xl" | "md" | undefined = 'md';

	import { Avatar, Carousel } from 'flowbite-svelte';

	let isOpen = false;
	let imageUrl: any = ''; // Set the image URL you want to display

	function openModal(urls: any, item: any) {
		if (Array.isArray(urls)) {
			imageUrl = urls.map((url) => {
				let img = getPbImageUrl(item, url, '0x0');
				return {
					alt: 'no image',
					imgurl: img,
					src: img,
					title: 'skul pics'
				};
			});
		} else {
			imageUrl = getPbImageUrl(item, urls, '0x0');
		}
		isOpen = true;
	}
	function closeModal() {
		isOpen = false;
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div on:click={() => openModal(value?.value, item)}>
	{#if Array.isArray(value?.value)}
		<Avatar size={size} rounded src={getPbImageUrl(item, value?.value[0], undefined) ?? undefined} />
	{:else}
		<Avatar
			size={size}
			rounded
			src={getPbImageUrl(item, value?.value + '', undefined) ?? undefined}
		/>
	{/if}
</div>
{#if isOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center">
		<div class="modal-overlay absolute inset-0 bg-black opacity-50" />
		<div class="modal-container bg-white w-300 p-4 shadow-lg rounded-lg relative">
			<button
				class="absolute z-10 top-2 right-2 text-gray-500 hover:bg-slate-600 hover:text-gray-700 focus:outline-none"
				on:click={closeModal}
			>
				<svg
					class="w-6 h-6"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>
			<div
				class="w-full h-full overflow-y-auto overflow-hidden custom-scrollbar"
				style="max-width: 90vh; max-height: 90vh;"
			>
				{#if Array.isArray(imageUrl)}
					<Carousel
						divClass="w-full h-full max-h-full object-contain"
						slideClass="bg-red-500"
						showIndicators={false}
						images={imageUrl}
						showThumbs={false}
						loop={false}
						showCaptions={false}
					/>
				{:else}
					<img src={imageUrl} alt="Preview" class="w-full h-full max-h-full object-contain" />
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	/* Add custom CSS to hide the scrollbar */
	.custom-scrollbar::-webkit-scrollbar {
		width: 0.4em; /* Adjust the width as needed */
	}

	.custom-scrollbar::-webkit-scrollbar-track {
		background: transparent;
	}

	.custom-scrollbar::-webkit-scrollbar-thumb {
		background-color: transparent;
	}
</style>
