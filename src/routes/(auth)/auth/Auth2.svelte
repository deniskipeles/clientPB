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
      const authData = await pb.collection(auth_collection).authWithOAuth2({ provider: provider?.name });
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
  export let head="Login"
</script>

{#if authData?.authProviders.length > 0}
  <h2 class="text-lg font-bold mb-4">{head} with:</h2>
    <div class="grid grid-cols-2 gap-6">
      {#each authData?.authProviders ?? [] as provider}
        <Button 
          pill
          type="button"
          on:click={() => handleOAuthLogin(provider)}
        >
          {provider.displayName}
        </Button>
      {/each}
    </div>
{/if}

{#if isLoading}
  <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 9999;" class="inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
    <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
  </div>
{/if}