<script>
	import { goto } from '$app/navigation';
	import { pb } from '$lib/pocketbase';
	import {
		Card,
		Button,
	} from 'flowbite-svelte';
	import { onMount } from 'svelte';

	export let authData;
	export let auth_collection;
	let isLoading = false;
	
	async function handleOAuthLogin(provider) {
    isLoading = true;
    // Simulate login process
    try{
      const authData = await pb.collection(users_collection).authWithOAuth2({ provider: provider?.name });
      if(authData.token){
        goto('/account', { replaceState: true });
        isLoading=false;
      }else{
        isLoading=false;
      }
    }catch(e){
      console.log(e)
      isLoading=false
    }
  }
</script>

{#if authData?.authProviders}
  <h2 class="text-lg font-bold mb-4">Login with:</h2>
    <div class="mb-4">
      {#each authData?.authProviders ?? [] as provider}
        <Button 
          color="alternative" 
          pill
          on:click={() => handleOAuthLogin(provider)}
        >
          {provider.displayName}
        </Button>
      {/each}
    </div>
{/if}

{#if isLoading}
  <div class="absolute z-50 z-index-50 inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
    <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
  </div>
{/if}