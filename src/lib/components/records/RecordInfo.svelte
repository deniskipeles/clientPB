<script>
	import CommonHelper from '$lib/utils/CommonHelper';
	import tooltip from '$lib/actions/tooltip';
	import { collections } from '$lib/stores/collections';
	import RecordFileThumb from '$lib/components/records/RecordFileThumb.svelte';
	import { page } from '$app/stores';

	export let record;

	$: if (record) {
		delete record.id;
		delete record.collectionId;
		delete record.collectionName;
		delete record.email;
		delete record.emailVisibility;
		delete record.username;
		delete record.verified;
	}

	$: collection = $page.data?.tables?.find((item) => item.id == record?.collectionId);

	$: fileDisplayFields =
		collection?.schema?.filter((f) => f.presentable && f.type == 'file')?.map((f) => f.name) || [];

	$: textDisplayFields =
		collection?.schema?.filter((f) => f.presentable && f.type != 'file')?.map((f) => f.name) || [];
</script>

<div class="record-info">
	<i
		class="link-hint txt-sm ri-information-line"
		use:tooltip={{
			text: CommonHelper.truncate(
				JSON.stringify(CommonHelper.truncateObject(record), null, 2),
				800,
				true
			),
			class: 'code',
			position: 'left'
		}}
	/>

	{#each fileDisplayFields as name}
		{@const filenames = CommonHelper.toArray(record[name]).slice(0, 5)}
		{#each filenames as filename}
			{#if !CommonHelper.isEmpty(filename)}
				<RecordFileThumb {record} {filename} size="xs" />
			{/if}
		{/each}
	{/each}

	<span class="txt txt-ellipsis">
		{CommonHelper.truncate(CommonHelper.displayValue(record, textDisplayFields), 70)}
	</span>
</div>

<style lang="scss">
	.record-info {
		display: inline-flex;
		vertical-align: top;
		align-items: center;
		max-width: 100%;
		min-width: 0;
		gap: 5px;
		line-height: normal;
		> * {
			line-height: inherit;
		}
		:global(.thumb) {
			box-shadow: none;
		}
	}
</style>
