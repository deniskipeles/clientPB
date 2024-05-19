<script>
	import { goto } from '$app/navigation';
	import { pb } from '$lib/pocketbase';
	import {
		Card,
		Button,
		GradientButton
	} from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import Backdrop from '$lib/components/base/Backdrop.svelte';

	export let authData;
	export let auth_collection;
	$: isLoading = false;
	
	async function handleOAuthLogin(provider) {
    isLoading = true;
    // Simulate login process
    try{
      const authData = await pb.collection(auth_collection).authWithOAuth2({ provider: provider?.name });
      if(authData.token){
        goto('/account', { 
          replaceState: true,
          invalidateAll: true
        });
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
    <div class="flex flex-wrap gap-0">
      {#each authData?.authProviders ?? [] as provider}
        <button
          type="button"
          class="btn btn-pill btn-outline"
          on:click={() => handleOAuthLogin(provider)}
        >
          <i class={`ri-${provider.name}-line`} />
					<span class="txt">
					  {provider.displayName}
					</span>
        </button>
      {/each}
    </div>
    <h1 class="text-xl font-bold mb-2 mt-2">OR</h1>
    <hr/>
{/if}
<Backdrop {isLoading}/>
