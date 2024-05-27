<script>
  import { goto } from '$app/navigation';
  import {
    Card,
    Button,
    Breadcrumb,
    BreadcrumbItem
  } from 'flowbite-svelte';
  
  /** @type {import('./$types').PageData} */
  export let data;
</script>

<Breadcrumb class="pt-20 py-8">
  <BreadcrumbItem href="/" home>Home</BreadcrumbItem>
  <BreadcrumbItem>Articles</BreadcrumbItem>
</Breadcrumb>

<div>
  {JSON.stringify(data)}
</div>
