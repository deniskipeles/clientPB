<script>
	// @ts-nocheck
	import { page } from '$app/stores';

	import { item_on_focus_store } from '$lib/stores';

	export let onOpen;
	export let onViewRecord;
	export let target = '';

	// pos is cursor position when right click occur
	let pos = { x: 0, y: 0 };
	// menu is dimension (height and width) of context menu
	let menu = { h: 0, y: 0 };
	// browser/window dimension (height and width)
	let browser = { h: 0, y: 0 };
	// showMenu is state of context-menu visibility
	let showMenu = false;
	// to display some text
	let content;

	function rightClickContextMenu(e) {
		item_on_focus_store.set(target);
		showMenu = true;
		browser = {
			w: window.innerWidth,
			h: window.innerHeight
		};
		pos = {
			x: e.clientX,
			y: e.clientY
		};
		// console.log(pos.x,pos.y)
		// If bottom part of context menu will be displayed
		// after right-click, then change the position of the
		// context menu. This position is controlled by `top` and `left`
		// at inline style.
		// Instead of context menu is displayed from top left of cursor position
		// when right-click occur, it will be displayed from bottom left.
		if (browser.h - pos.y < menu.h) pos.y = pos.y - menu.h;
		if (browser.w - pos.x < menu.w) pos.x = pos.x - menu.w;
		// console.log('rigth click');
	}

	function onPageClick(e) {
		// To make context menu disappear when
		// mouse is clicked outside context menu
		showMenu = false;
	}
	function getContextMenuDimension(node) {
		// This function will get context menu dimension
		// when navigation is shown => showMenu = true
		let height = node.offsetHeight;
		let width = node.offsetWidth;
		menu = {
			h: height,

			w: width
		};
	}

	function onEdit() {
		onOpen();
		showMenu = false
	}

	function zoom() {
		content.textContent = 'Zooom...';
	}
	function remove() {
		content.textContent = 'Removed...';
	}
	function onView() {
		onViewRecord()
		showMenu = false
	}

	$: menuItems = [
		{
			name: 'edit',
			onClick: onEdit,
			displayText: 'Edit',
			class: 'fa-solid fa-pen'
		},
		{
			name: 'hr'
		},
		{
			name: 'view',
			onClick: onView,
			displayText: 'View',
			class: 'fa-solid fa-eye'
		},
		{
			name: 'hr'
		},
		{
			name: 'delete',
			onClick: remove,
			displayText: 'Delete',
			class: 'fa-solid fa-trash-can'
		},
		{
			name: 'hr'
		},
		{
			name: 'close',
			onClick: onPageClick,
			displayText: 'Close',
			class: 'fa-solid fa-times'
		}
	];
	$: {
		if ($page.data.user?.collectionName?.includes('student') || !$page.data.user) {
			menuItems = menuItems.filter((i) => i.name !== 'edit' && i.name !== 'delete' && i.name !=='hr');
		}
	}
</script>

<tr
	class="border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
	on:contextmenu|preventDefault={rightClickContextMenu}
	on:click={onPageClick}
>
	<slot />
</tr>

{#if showMenu && target == $item_on_focus_store && target != ''}
	<nav use:getContextMenuDimension style="position: absolute; top:{pos.y}px; left:{pos.x}px">
		<div class="navbar border-2 dark:text-white dark:bg-slate-900 " id="navbar">
			<ul>
				{#each menuItems as item}
					{#if item.name == 'hr'}
						<hr />
					{:else}
						<li class="hover:bg-gray-500 dark:bg-slate-900 bg-slate-300 text-slate-600 dark:hover:bg-slate-500">
							<button on:click={item.onClick}><i class={item.class} />{item.displayText}</button>
						</li>
					{/if}
				{/each}
			</ul>
		</div>
	</nav>
{/if}

<!-- <svelte:window on:contextmenu|preventDefault={rightClickContextMenu} on:click={onPageClick} /> -->

<style>
	/* * {
		padding: 0;
		margin: 0;
	} */
	.navbar {
		display: inline-flex;
		/* border: 1px #999 solid; */
		width: 170px;
		/* background-color: #fff; */
		border-radius: 10px;
		overflow: hidden;
		flex-direction: column;
	}
	.navbar ul {
		margin: 6px;
	}
	ul li {
		display: block;
		list-style-type: none;
		width: 1fr;
	}
	ul li button {
		font-size: 1rem;
		/* color: #222; */
		width: 100%;
		height: 30px;
		text-align: left;
		border: 0px;
		/* background-color: #fff; */
	}
	ul li button:hover {
		/* color: #000; */
		text-align: left;
		border-radius: 5px;
		/* background-color: #eee; */
	}
	ul li button i {
		padding: 0px 15px 0px 10px;
	}
	ul li button i.fa-square {
		/* color: #fff; */
	}
	ul li button:hover > i.fa-square {
		/* color: #eee; */
	}
	ul li button:hover > i.warning {
		/* color: crimson; */
	}
	:global(ul li button.info:hover) {
		/* color: navy; */
	}
	hr {
		border: none;
		border-bottom: 1px solid #ccc;
		margin: 5px 0px;
	}
</style>
