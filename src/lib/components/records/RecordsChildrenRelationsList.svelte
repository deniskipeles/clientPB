<script>
    import { createEventDispatcher } from "svelte";
    import CommonHelper from "$lib/utils/CommonHelper";
    // import ApiClient from "$lib/utils/ApiClient"; 
    import scrollend from "$lib/actions/scrollend";
    import tooltip from "$lib/actions/tooltip";
    import OverlayPanel from "$lib/components/base/OverlayPanel.svelte";
    import Searchbar from "$lib/components/base/Searchbar.svelte";
    import Draggable from "$lib/components/base/Draggable.svelte";
    import RecordInfo from "$lib/components/records/RecordInfo.svelte";
    import RecordUpsertPanel from "$lib/components/records/RecordUpsertPanel.svelte";
    import { collections } from "$lib/stores/collections";
	import { pb as ApiClient } from "$lib/pocketbase";
	import { page } from "$app/stores";

    const dispatch = createEventDispatcher();
    const uniqueId = "picker_" + CommonHelper.randomString(5);
    const batchSize = 50;

    export let collection;

    let pickerPanel;
    let upsertPanel;
    let filter = "";
    let list = [];
    let selected = [];
    let currentPage = 1;
    let lastItemsCount = 0;
    let totalItems = 0;
    let isLoadingList = false;
    let isLoadingSelected = false;

    

    $: collectionId = collection?.id;

    $: if (typeof filter !== "undefined" && pickerPanel?.isActive()) {
        loadList(true); // reset list on filter change
    }

    $: isView = false //collection?.type === "view";

    $: isLoading = isLoadingList || isLoadingSelected;

    $: canLoadMore = lastItemsCount == batchSize;

    
    export function show() {
        filter = "";
        list = [];
        selected = [];
        loadList(true);

        return pickerPanel?.show();
    }

    export function hide() {
        return pickerPanel?.hide();
    }

    async function loadList(reset = false) {
        if (!collectionId) {
            return;
        }

        isLoadingList = true;

        if (reset) {
            if (!filter.trim()) {
                // prepend the loaded selected items
                list = CommonHelper.toArray(selected).slice();
            } else {
                list = [];
            }
        }

        try {
            const page = reset ? 1 : currentPage + 1;

            const fallbackSearchFields = CommonHelper.getAllCollectionIdentifiers(collection);

            const result = await ApiClient.collection(collectionId).getList(page, batchSize, {
                filter: CommonHelper.normalizeSearchFilter(filter, fallbackSearchFields),
                sort: !isView ? "-created" : "",
                fields: "*:excerpt(200)",
                skipTotal: 1,
                requestKey: uniqueId + "loadList",
            });

            list = CommonHelper.filterDuplicatesByKey(list.concat(result.items));
            currentPage = result.page;
            lastItemsCount = result.items.length;
            totalItems = result.totalItems;

            isLoadingList = false;
        } catch (err) {
            if (!err.isAbort) {
                ApiClient.error(err);
                isLoadingList = false;
            }
        }
    }
   
</script>

<OverlayPanel bind:this={pickerPanel} popup class="overlay-panel-xl" on:hide on:show {...$$restProps}>
    <svelte:fragment slot="header">
        <h4>
            View <strong>{collection?.name || ""}</strong> records
        </h4>
    </svelte:fragment>

    <div class="flex m-b-base flex-gap-10">
        <Searchbar
            value={filter}
            autocompleteCollection={collection}
            on:submit={(e) => (filter = e.detail)}
        />
    </div>
    <p>The latest {batchSize} records are fetched. If what you are looking for is not among it, then search to fetch desired records.</p>

    <div
        class="list picker-list m-b-base"
        use:scrollend={() => {
            if (canLoadMore && !isLoadingList) {
                loadList();
            }
        }}
    >
        {#each list as record (record.id)}
            <div
                tabindex="0"
                class="list-item handle"
                class:selected={true}
                class:disabled={true}
            >
                <i class="ri-checkbox-circle-fill txt-success" />
                <div class="content">
                    <RecordInfo {record} />
                </div>
                <!--{#if !isView}
                    <div class="actions nonintrusive">
                        <button
                            type="button"
                            class="btn btn-sm btn-circle btn-transparent btn-hint m-l-auto"
                            use:tooltip={"view"}
                            on:keydown|stopPropagation
                            on:click|stopPropagation={() => upsertPanel?.show(record)}
                        >
                            <i class="ri-eye-line" />
                        </button>
                    </div>
                {/if}-->
            </div>
        {:else}
            {#if !isLoading}
                <div class="list-item">
                    <span class="txt txt-hint">No records found.</span>
                    {#if filter?.length}
                        <button type="button" class="btn btn-hint btn-sm" on:click={() => (filter = "")}>
                            <span class="txt">Clear filters</span>
                        </button>
                    {/if}
                </div>
            {/if}
        {/each}

        {#if isLoading}
            <div class="list-item">
                <div class="block txt-center">
                    <span class="loader loader-sm active" />
                </div>
            </div>
        {/if}
    </div>

    <h5 class="section-title">
        Loaded ({list.length} of {totalItems})
        {/if}
    </h5>
    

    <svelte:fragment slot="footer">
        <button type="button" class="btn btn-transparent" on:click={() => hide()}>
            <span class="txt">Close</span>
        </button>
    </svelte:fragment>
</OverlayPanel>

<!--RecordUpsertPanel
    bind:this={upsertPanel}
    {collection}
    on:save={(e) => {
        CommonHelper.removeByKey(list, "id", e.detail.record.id);
        list.unshift(e.detail.record);
        list = list;

        select(e.detail.record);
    }}
    on:delete={(e) => {
        CommonHelper.removeByKey(list, "id", e.detail.id);
        list = list;

        deselect(e.detail);
    }}
/-->

<style lang="scss">
    .picker-list {
        max-height: 380px;
    }
</style>
