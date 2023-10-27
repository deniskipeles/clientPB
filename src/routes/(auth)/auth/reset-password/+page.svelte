<script>
	import { applyAction, enhance } from '$app/forms';
	import ErrorComp from '$lib/components/ErrorComp.svelte';
	import { pb } from '$lib/pocketbase';
	import { addErrorToast, addSuccessToast } from '$lib/stores/toasts';
	import {
		Button,
		Label,
		Input,
		Breadcrumb,
		BreadcrumbItem,
		Spinner
	} from 'flowbite-svelte';

	/** @type {import('./$types').PageData} */
	export let data;
  $: if (form?.success) {
    addSuccessToast(form.msg)
  }
  $: if (!form?.success && form?.msg) {
    addErrorToast(form.msg)
  }
	
	/** @type {import('./$types').ActionData} */
	export let form;

	let loading = false;
  let group = 'students'
</script>

<svelte:head>
	<title>Password Reset Form</title>
	<meta name="description" content="Password Reset Form" />
</svelte:head>

<Breadcrumb class="pt-16 py-8">
	<BreadcrumbItem href="/" home>Home</BreadcrumbItem>
	<BreadcrumbItem>Password Reset</BreadcrumbItem>
</Breadcrumb>

{#if form?.error}
	<ErrorComp error={form?.error} />
{/if}

<form
	class="flex flex-col space-y-6"
	method="POST"
	use:enhance={() => {
		loading = true;
		return async ({ result, update }) => {
			pb.authStore.loadFromCookie(document.cookie);
			await applyAction(result);
			loading = false;
		};
	}}
>
<div class="grid grid-cols-2 gap-6">
  {#each data?.authTables as item}
    <div class="form-field">
      <input name="user_type" type="radio" id="radio-{item}" bind:group value={item} />
      <label for="radio-{item}">{item}</label>
    </div>
  {/each}
</div>
	<h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">Password Reset</h3>
	<Label class="space-y-2">
		<span>Email</span>
		<Input type="email" name="email" placeholder="name@company.com" required />
	</Label>
{group}
	{#if loading}
		<Button id="b2" class="-mb-2">
			<Spinner />loading...
		</Button>
	{:else}
		<Button type="submit" class="w-full">Request Password Reset</Button>
	{/if}
</form>
