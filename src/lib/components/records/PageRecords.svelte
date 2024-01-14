<script>
	import { tick } from 'svelte';
	// import { querystring } from "svelte-spa-router";
	import CommonHelper from '$lib/utils/CommonHelper';
	import {
		collections,
		activeCollection,
		isCollectionsLoading,
		loadCollections,
		changeActiveCollectionById,
		view_cards
	} from '$lib/stores/collections';
	import tooltip from '$lib/actions/tooltip';
	import { pageTitle, hideControls } from '$lib/stores/app';
	import PageWrapper from '$lib/components/base/PageWrapper.svelte';
	import Searchbar from '$lib/components/base/Searchbar.svelte';
	import RefreshButton from '$lib/components/base/RefreshButton.svelte';
	import RecordUpsertPanel from '$lib/components/records/RecordUpsertPanel.svelte';
	import RecordPreviewPanel from '$lib/components/records/RecordPreviewPanel.svelte';
	import RecordsList from '$lib/components/records/RecordsList.svelte';
	import RecordsCount from '$lib/components/records/RecordsCount.svelte';
	import { page } from '$app/stores';
	import { afterNavigate } from '$app/navigation';
	import RecordsActionsButtons from '../RecordsActionsButtons.svelte';
	import Toggler from '../base/Toggler.svelte';
	import Field from '../base/Field.svelte';
	import BulkAttendancePerClass from '../base/BulkAttendancePerClass.svelte';
	import QuestionsListing from '../base/QuestionsListing.svelte';

	// const initialQueryParams = new URLSearchParams($querystring);
	const initialQueryParams = $page.url.searchParams;

	export let collectionUpsert = $activeCollection;
	export let collection = $activeCollection;
	let recordUpsertPanel;
	let recordPreviewPanel;
	let recordsList;
	let recordsCount;
	let filter = initialQueryParams.get('filter') || '';
	let sort = initialQueryParams.get('sort') || '-created';
	let selectedCollectionId = $activeCollection?.id;
	let totalCount = 0; // used to manully change the count without the need of reloading the recordsCount component

	// loadCollections(selectedCollectionId);
	afterNavigate(() => loadCollections(selectedCollectionId));

	// $: reactiveParams = new URLSearchParams($querystring);
	$: reactiveParams = new URLSearchParams($page.url.searchParams);

	$: if (
		!$isCollectionsLoading &&
		reactiveParams.get('collectionId') &&
		reactiveParams.get('collectionId') != selectedCollectionId
	) {
		changeActiveCollectionById(reactiveParams.get('collectionId'));
	}

	// reset filter and sort on collection change
	$: if ($activeCollection?.id && selectedCollectionId != $activeCollection.id) {
		reset();
	}

	$: if ($activeCollection?.id) {
		normalizeSort();
	}

	// $: if (!$isCollectionsLoading && initialQueryParams.get("recordId")) {
	//     showRecordById(initialQueryParams.get("recordId"));
	// }

	// keep the url params in sync
	$: if (!$isCollectionsLoading && (sort || filter || $activeCollection?.id)) {
		updateQueryParams();
	}

	$: $pageTitle = $activeCollection?.name || 'Collections';

	async function showRecordById(recordId) {
		await tick(); // ensure that the reactive component params are resolved

		$activeCollection?.type === 'view'
			? recordPreviewPanel.show(recordId)
			: recordUpsertPanel?.show(recordId);
	}

	function reset() {
		selectedCollectionId = $activeCollection?.id;
		filter = '';
		sort = '-created';

		updateQueryParams({ recordId: null });

		normalizeSort();
	}

	// ensures that the sort fields exist in the collection
	async function normalizeSort() {
		if (!sort) {
			return; // nothing to normalize
		}

		const collectionFields = CommonHelper.getAllCollectionIdentifiers($activeCollection);

		const sortFields = sort.split(',').map((f) => {
			if (f.startsWith('+') || f.startsWith('-')) {
				return f.substring(1);
			}
			return f;
		});

		// invalid sort expression or missing sort field
		if (sortFields.filter((f) => collectionFields.includes(f)).length != sortFields.length) {
			if (collectionFields.includes('created')) {
				sort = '-created';
			} else {
				sort = '';
			}
		}
	}

	function updateQueryParams(extra = {}) {
		// const queryParams = Object.assign(
		//     {
		//         collectionId: $activeCollection?.id || "",
		//         filter: filter,
		//         sort: sort,
		//     },
		//     extra
		// );
		// CommonHelper.replaceHashQueryParams(queryParams);
	}
	$: contenteditable = false;
	function contenteditableFxn(params) {
		contenteditable = params;
	}

	let questionUpsertPanel;
	$: is_student = $page.data?.user?.collectionName?.includes('student');
</script>

{#if $isCollectionsLoading}
	<PageWrapper center>
		<div class="placeholder-section m-b-base mt-16">
			<span class="loader loader-lg" />
			<h1>Loading collections...</h1>
		</div>
	</PageWrapper>
{:else}
	<PageWrapper class="flex-content mt-16">
		<RecordsActionsButtons {contenteditableFxn} {collection} {contenteditable} />
		<header class="page-header">
			<nav class="breadcrumbs">
				<div class="breadcrumb-item capitalize">
					{collectionUpsert?.name?.split('_')?.join(' ')}
				</div>
				<div class="breadcrumb-item dark:text-white">Records</div>
			</nav>

			<div class="inline-flex gap-5">
				<Field class="form-field form-field-sm form-field-toggle m-0 p-5" let:uniqueId>
					<input
						type="checkbox"
						id={uniqueId}
						checked={$view_cards}
						on:change={(e) => {
							view_cards.set(!$view_cards);
						}}
					/>
					<label for={uniqueId}>{$view_cards ? 'Table View' : 'Cards View'}</label>
				</Field>
			</div>

			<div class="inline-flex gap-5">
				<RefreshButton
					on:refresh={() => {
						recordsList?.load();
						recordsCount?.reload();
					}}
				/>
			</div>

			<div class="btns-group">
				{#if $activeCollection.type && $page.data.user && !$page.data.user.collectionName?.includes('student')}
					{#if $page.params?.slug?.includes('attendances')}
					<BulkAttendancePerClass
						on:save={(e) => {
							recordsCount?.reload();
							recordsList?.reloadLoadedPages();
						}}
						{collectionUpsert}
					/>
					{/if}
					<button type="button" class="btn btn-expanded" on:click={() => recordUpsertPanel?.show()}>
						<i class="ri-add-line" />
						<span class="txt">New record</span>
					</button>
				{/if}
			</div>
		</header>

		<Searchbar
			value={filter}
			autocompleteCollection={$activeCollection}
			on:submit={(e) => (filter = e.detail)}
		/>

		<div class="clearfix m-b-sm" />

		<div id="printableThis" {contenteditable}>
			<RecordsList
				bind:this={recordsList}
				collection={$activeCollection}
				{collectionUpsert}
				bind:filter
				bind:sort
				on:select={(e) => {
					let showModel = e.detail._partial ? e.detail.id : e.detail;

					$activeCollection.name?.includes('tests') && is_student
						? questionUpsertPanel.show(showModel)
						: (e.detail.edit && !is_student)
						? recordUpsertPanel?.show(showModel)
						: recordPreviewPanel?.show(showModel);
				}}
				on:delete={() => {
					recordsCount?.reload();
				}}
				on:new={() => recordUpsertPanel?.show()}
			/>
		</div>

		<svelte:fragment slot="footer">
			<RecordsCount
				bind:this={recordsCount}
				class="m-r-auto txt-sm txt-hint"
				collection={$activeCollection}
				{filter}
				bind:totalCount
			/>
		</svelte:fragment>
	</PageWrapper>
{/if}

<RecordUpsertPanel
	bind:this={recordUpsertPanel}
	collection={collectionUpsert}
	on:hide={() => {
		updateQueryParams({ recordId: null });
	}}
	on:save={(e) => {
		if (filter) {
			// if there is applied filter, reload the count since we
			// don't know after the save whether the record satisfies it
			recordsCount?.reload();
		} else if (e.detail.isNew) {
			totalCount++;
		}

		recordsList?.reloadLoadedPages();
	}}
	on:delete={(e) => {
		if (!filter || recordsList?.hasRecord(e.detail.id)) {
			totalCount--;
		}

		recordsList?.reloadLoadedPages();
	}}
/>

<RecordPreviewPanel
	bind:this={recordPreviewPanel}
	collection={$activeCollection}
	on:hide={() => {
		updateQueryParams({ recordId: null });
	}}
/>

<QuestionsListing
	bind:this={questionUpsertPanel}
	{collectionUpsert}
	collection={$activeCollection}
	on:save={(e) => {
		recordsCount?.reload();
		recordsList?.reloadLoadedPages();
	}}
/>
