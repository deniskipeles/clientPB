<!-- Drawer.svelte -->
<script lang="ts">
	import type { RecordModel } from 'pocketbase';

	import DynamicForm from './DynamicForm.svelte';
	import RelationTable from './RelationTable.svelte';
	import OverlayPanel from './base/OverlayPanel.svelte';
	import { onMount } from 'svelte';
	import tooltip from '$lib/actions/tooltip';
	export let isOpen = false;
	export let record: RecordModel;
	export let onClose: Function;
	$: dataForm = record;

	
	let popupActive:any
	$: enableOverlay = false
	onMount(()=>enableOverlay=true)
</script>

{#if isOpen}
	<div
		class="fixed inset-0 flex items-start ml-2 justify-center z-auto"
		style="background-color: rgba(0, 0, 0, 0.5);"
		class:visible={isOpen}
	>
		<div
			class="custom-scrollbar absolute overflow-auto inset-y-0 right-0 bg-white rounded-lg p-4 shadow-md w-full md:w-1/2"
			class:translate-x-0={isOpen}
			class:translate-x-full={!isOpen}
		>
			<button
				class="absolute top-0 right-0 mt-2 mr-2 text-gray-500 hover:text-gray-700"
				on:click={() => onClose()}
			>
				<svg
					class="h-5 w-5"
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

			<!-- Render the DynamicForm component -->
			<DynamicForm {dataForm} {onClose} />
		</div>
	</div>
{/if}

<button on:click={() => popupActive = true} type="button">test show {popupActive}</button>

{#if enableOverlay && document !== undefined}
	 <OverlayPanel bind:active={popupActive} popup={false}>
			 <h5 slot="header">My title</h5>
			 <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Reiciendis magni adipisci at commodi
				earum quod voluptatibus. Deserunt minus delectus sapiente tempore corporis, minima nesciunt natus
				laudantium beatae nulla ratione commodi.</p>
			 <svelte:fragment slot="footer">
				 <button use:tooltip={'Are you sure you want to cancel.'} on:click={()=>popupActive=false} class="btn btn-transparent">Cancel</button>
				 <button class="btn btn-expanded">Save</button>
			 </svelte:fragment>
		 </OverlayPanel>
{/if}




<!-- let rel_results: RecordModel[] = [];
	let relation = {
		id: 'relation_1',
		collectionId: `${record?.collectionId}`,
		data: rel_results,
		z: 'z-0'
	};
	let index = -1;
	$: index1 = index;
	$: random = 'random_val';
<div style="position: fixed; inset: 0; z-index: {index1};">
	Lorem ipsum dolor, sit amet consectetur adipisicing elit. Reiciendis magni adipisci at commodi
	earum quod voluptatibus. Deserunt minus delectus sapiente tempore corporis, minima nesciunt natus
	laudantium beatae nulla ratione commodi.{random}
</div>
<button on:click={() => (index -= 1)} type="button">- {index1}</button> -->