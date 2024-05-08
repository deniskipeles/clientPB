<script>
	import {
		Card,
		Button,
		Label,
		Input,
		Checkbox,
		Breadcrumb,
		BreadcrumbItem,
		Spinner,
		Radio
	} from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	
	import Auth2 from '../Auth2.svelte';

	/** @type {import('./$types').PageData} */
	export let data;
	onMount(() => {
		if (data?.user) {
			goto('/account', { replaceState: true });
		}
	});
	/** @type {import('./$types').ActionData} */
	export let form;
	let loading = false;

	import { applyAction, enhance } from '$app/forms';
	import { pb } from '$lib/pocketbase';
	import { ErrorComp } from '$lib/components';
	let group = data.authTables[0];
	$: authData = data.auth2[group]
</script>

<svelte:head>
	<title>Login Form</title>
	<meta name="description" content="This Form is for signing in users." />
</svelte:head>

<Breadcrumb class="pt-16 py-8">
	<BreadcrumbItem href="/" home>Home</BreadcrumbItem>
	<BreadcrumbItem>Login</BreadcrumbItem>
</Breadcrumb>

{#if form?.error}
	<ErrorComp error={form?.error} />
{/if}

<div class="text-center">
	<Auth2 {authData}/>
	<Card>
		<form
			class="flex flex-col space-y-6"
			method="POST"
			use:enhance={() => {
				loading = true;
				return async ({ result }) => {
					pb.authStore.loadFromCookie(document.cookie);
					await applyAction(result);
					loading = false;
				};
			}}
		>
			<h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">Sign in to our platform</h3>
			<div class="grid grid-cols-2 gap-6">
				{#each data?.authTables as item}
					<div class="form-field">
						<input name="user_type" type="radio" id="radio-{item}" bind:group value={item} />
						<label for="radio-{item}">{item}</label>
					</div>
				{/each}
			</div>
			{group}
			<Label class="space-y-2">
				<span>Email / Staff No / ADM No</span>
				<Input type="text" name="email" placeholder="user123" required />
			</Label>
			<Label class="space-y-2">
				<span>Your password</span>
				<Input type="password" name="password" placeholder="•••••" required />
			</Label>

			<div class="flex items-start">
				<!-- <Checkbox>Remember me</Checkbox> -->
				<a href="/auth/reset-password" class="ml-auto text-sm text-blue-700 hover:underline dark:text-blue-500"
					>Lost password?</a
				>
			</div>
			{#if loading}
				<Button id="b2" class="-mb-2">
					<Spinner />loading...
				</Button>
			{:else}
				<Button type="submit" class="w-full">Login to your account</Button>
			{/if}
			<div class="text-sm font-medium text-gray-500 dark:text-gray-300">
				Not registered? <a
					href="/auth/register"
					class="text-blue-700 hover:underline dark:text-blue-500">Create account</a
				>
			</div>
		</form>
	</Card>
</div>
