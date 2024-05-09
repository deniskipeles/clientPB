<script>
  import { afterUpdate } from 'svelte';
  import { afterNavigate } from '$app/navigation';

  export let isLoading = false;

  afterUpdate(() => {
    setTimeout(() => {
      isLoading = false
    }, 30000);
  });
  afterNavigate(() => {
    setTimeout(() => {
      isLoading = false
    }, 30000);
  });
</script>

{#if isLoading}
  <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 9999;" class="inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
    <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
  </div>
{/if}