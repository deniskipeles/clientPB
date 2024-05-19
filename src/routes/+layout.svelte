<script lang="ts">
	import '$lib/scss/main.scss';
	import '../app.postcss';
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import {
		DarkMode,
		Navbar,
		NavBrand,
		NavLi,
		NavUl,
		NavHamburger,
		Sidebar,
		SidebarGroup,
		SidebarItem,
		SidebarWrapper,
		Drawer,
		CloseButton,
		SidebarDropdownWrapper
	} from 'flowbite-svelte';
	import { AcademicCap } from 'svelte-heros-v2';
	import { sineIn } from 'svelte/easing';
	import { FooterComp } from '$lib/components';
	import Toasts from '$lib/components/base/Toasts.svelte';
	import Confirmation from '$lib/components/base/Confirmation.svelte';

	let transitionParams = {
		x: -320,
		duration: 200,
		easing: sineIn
	};
	export let data: PageData;

	let breakPoint: number = 1024;
	let width: number;
	let backdrop: boolean = false;
	let activateClickOutside = true;
	let drawerHidden: boolean = false;
	$: if (width >= breakPoint) {
		drawerHidden = false;
		activateClickOutside = false;
	} else {
		drawerHidden = true;
		activateClickOutside = true;
	}
	let showWhichHasOverlay = false;
	
	const loadEruda = () => {
		let script = document.createElement('script');
    script.src = "//cdn.jsdelivr.net/npm/eruda"
    document.head.append(script);
		script.onload = () => {
      window.eruda.init();
		};
	};
	onMount(() => {
	  //loadEruda()
		showWhichHasOverlay = true;
		if (width >= breakPoint) {
			drawerHidden = false;
			activateClickOutside = false;
		} else {
			drawerHidden = true;
			activateClickOutside = true;
		}
	});
	const toggleSide = () => {
		if (width < breakPoint) {
			drawerHidden = !drawerHidden;
		}
	};
	const toggleDrawer = () => {
		drawerHidden = false;
	};
	$: app = $page.data?.app ?? {};

	$: roots_ = $page.data?.roots?.filter((i: any) => i?.html_data != null && i?.html_data != '' && !i?.name?.includes('app')&& !i?.name?.includes('website')&& !i?.name?.includes('page') && !i?.name?.includes('home')) ?? [];
	
	$: activeUrl = $page.url.pathname;
	let spanClass = 'pl-2 self-center text-md text-gray-900 whitespace-nowrap dark:text-white';
	let divClass = 'w-full ml-auto lg:block lg:w-auto  lg:order-none z-50 right-0 top-0';
	let ulClass =
		'flex flex-col  lg:flex-row lg:my-0 text-sm font-medium gap-4 dark:lg:bg-transparent lg:bg-white lg:border-0';
	let navDivClass =
		'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 divide-gray-200 dark:divide-gray-700 flex items-center justify-between w-full mx-auto py-1.5 px-4';
		
		
	import { getPbImageUrl } from '$lib/utils';
	$: logo =
		app?.photos && Array.isArray(app?.photos)
			? app?.photos[app?.data?.logo ?? 0]
			: null;
	$: controls=$page.data?.roots?.find(obj=>obj.name=="controls") ?? {}
</script>

<svelte:head>
	<title>{app?.data?.name ?? 'ClientPB'}</title>
	<meta name="description" content={app?.data?.decription ?? 'ClientPB interactive page'} />
</svelte:head>

<svelte:window bind:innerWidth={width} />
<header style="position: fixed;" class="flex fixed z-50 w-full mx-auto bg-white dark:bg-slate-950">
	<Navbar {navDivClass} let:hidden let:toggle>
		<NavHamburger
			on:click={toggleDrawer}
			btnClass="focus:outline-none whitespace-normal rounded-lg focus:ring-2 p-1.5 focus:ring-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 m-0 mr-3 lg:hidden"
		/>
		<NavBrand href="/" class="lg:ml-0 gap-1">
		  
			{#if app?.photos?.length == 0}
			  <img alt={app?.data?.name ?? 'ClientPB'} class="me-3 h-6 sm:h-9" src='/favicon.svg' /> 
			{:else}
				{#await getPbImageUrl(app, logo, undefined) ?? '/favicon.svg' then value}
			    <img alt={app?.data?.name ?? 'ClientPB'} class="me-3 h-6 sm:h-9" src={`${value}`} />
				{/await}
			{/if}
			
			<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
				{app?.data?.name ?? 'ClientPB'}
			</span>
		</NavBrand>
		<NavUl
			{hidden}
			{divClass}
			{ulClass}
			nonActiveClass="md:!pl-3 md:!py-2 lg:!pl-0 text-gray-700 hover:bg-gray-100 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 dark:text-white lg:dark:hover:text-primary-700 dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent"
			activeClass="md:!pl-3 md:!py-2 lg:!pl-0 lg:text-primary-700 text-white dark:text-white dark:lg:text-primary-500 bg-primary-700 lg:bg-transparent dark:bg-primary-600 lg:dark:bg-transparent cursor-default"
		>
			<NavLi class="lg:px-2 lg:mb-0" active={activeUrl === '/'} href="/" on:click={toggle}>Home</NavLi>
			 
			<NavLi class="lg:px-2 lg:mb-0" active={activeUrl?.includes('/blog')} href="/blog" on:click={toggle} >blog</NavLi>
 			
 			{#each roots_ ?? [] as root}
			   <NavLi class="lg:px-2 lg:mb-0" active={activeUrl === `/${root?.id}`} href={`/${root?.id}`} on:click={toggle}
				>{root?.name ?? 'Page x'}</NavLi
			   >
			{/each}
			<NavLi
				class="lg:px-2 lg:mb-0 capitalize"
				href={$page?.data?.user ? `/account` : `/auth/login`}
				on:click={toggle}
				>{$page?.data?.user?.username ?? $page?.data?.user?.email ?? 'Login'}</NavLi
			>
		</NavUl>
		<NavHamburger on:click={toggle} btnClass="lg:hidden" />
	</Navbar>
	{#if controls?.data?.dark_mode}
	<div class="absolute z-50 lg:right-2 lg:top-4">
		<DarkMode
			btnClass="dark:bg-gray-100 text-gray-500 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5"
			class="inline-block  dark:hover:text-white hover:text-gray-900"
		/>
	</div>
	{/if}
</header>

<Drawer
	transitionType="fly"
	{backdrop}
	{transitionParams}
	bind:hidden={drawerHidden}
	bind:activateClickOutside
	width="w-64"
	class="z-50 overflow-scroll pb-32 mt-16"
	id="sidebar"
>
	<div class="flex items-center">
		<CloseButton on:click={() => (drawerHidden = true)} class="mb-4 dark:text-white lg:hidden" />
	</div>
	<Sidebar asideClass="w-54">
		<SidebarWrapper divClass="overflow-y-auto py-2 px-3 rounded dark:bg-gray-800 capitalize">
			<SidebarGroup>
				<SidebarItem label="Home" href="/" on:click={toggleSide} active={activeUrl === `/`} />
				{#each data?.tables as { name, type, id }}
					{#if type == 'view' && name.includes(`${$page.data?.user?.collectionName}_view_`) && name != 'view_tables'}
						<SidebarItem
							label={name.replace($page.data?.user?.collectionName, '').split('_').join(' ')}
							href={`/pages/${name}?collectionId=${id}`}
							{spanClass}
							activeClass="flex items-center p-2 text-base font-normal text-gray-900 bg-primary-200 dark:bg-primary-700 rounded-lg dark:text-white hover:bg-primary-100 dark:hover:bg-primary-700"
							on:click={toggleSide}
							active={activeUrl === `/pages/${name}`}
						/>
					{/if}
				{/each}
				<!-- {JSON.stringify($page.data.user)} -->
			</SidebarGroup>

			{#if $page?.data?.user}
				<SidebarGroup>
					<SidebarItem
						href={`/account`}
						label={`My Account`}
						{spanClass}
						on:click={toggleSide}
						active={activeUrl === `/account`}
					/>
				</SidebarGroup>
				<SidebarGroup>
					<span class={spanClass}>
						<form method="POST" action="/auth/logout">
							<button type="submit">logout<button /></button>
						</form>
					</span>
				</SidebarGroup>
			{:else}
				<SidebarGroup>
					<SidebarItem
						href={`/auth/login`}
						label={`Login`}
						{spanClass}
						on:click={toggleSide}
						active={activeUrl === `/auth/login`}
					/>
				</SidebarGroup>
				<SidebarGroup>
					<SidebarItem
						href={`/auth/register`}
						label={`Register`}
						{spanClass}
						on:click={toggleSide}
						active={activeUrl === `/auth/register`}
					/>
				</SidebarGroup>
			{/if}
		</SidebarWrapper>
	</Sidebar>
</Drawer>

<div class="flex px-4 mx-auto w-full">
	<main class="lg:pl-64 w-full mx-auto">
		<slot />
		<Toasts />
	</main>
</div>
{#if showWhichHasOverlay}
	<Confirmation />
{/if}
<div class="dark:bg-slate-900 mx-auto mb-4 pt-4 lg:pl-64">
	<FooterComp {app} />
</div>
