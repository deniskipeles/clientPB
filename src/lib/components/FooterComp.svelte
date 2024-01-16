<script lang="ts">
	import { getPbImageUrl } from '$lib/utils';
	import {
		Footer,
		FooterCopyright,
		FooterLinkGroup,
		FooterLink,
		FooterBrand,
		FooterIcon
	} from 'flowbite-svelte';
	import { AcademicCap } from 'svelte-heros-v2';
	// import { FacebookSolid, GithubSolid, DiscordSolid, TwitterSolid } from 'flowbite-svelte-icons';
	export let school: any;
	$: logo =
		school?.photos && Array.isArray(school?.photos)
			? school?.photos[school?.data?.logo ?? 0]
			: null;
</script>

<Footer footerType="socialmedia">
	<div class="md:flex md:justify-between">
		<div class="mb-6 md:mb-0">
			{#if school?.photos?.length == 0}
				<AcademicCap />
			{:else}
				{#await getPbImageUrl(school, logo, undefined) ?? '/favicon.svg' then value}
					<FooterBrand
						href="/"
						src={value ?? ''}
						alt={school?.data?.name ?? 'Prime School'}
						name={school?.data?.name ?? 'Prime School'}
					/>
				{/await}
			{/if}
		</div>
		<div class="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
			<div>
				<h2 class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
					Resources
				</h2>
				<FooterLinkGroup>
					<FooterLink liClass="mb-4" href="https://ktechs.xyz">ketchs</FooterLink>
					<FooterLink liClass="mb-4" href="/">Tailwind CSS</FooterLink>
				</FooterLinkGroup>
			</div>
			<div>
				<h2 class="mb-6 text-sm font-semibold uppercase text-gray-900 dark:text-white">
					Follow us
				</h2>
				<FooterLinkGroup>
					<FooterLink liClass="mb-4" href="https://github.com/deniskipeles">GitHub</FooterLink>
					<FooterLink liClass="mb-4" href="https://discord.com/invite/3buKPDsgym">Discord</FooterLink>
				</FooterLinkGroup>
			</div>
			<div>
				<h2 class="mb-6 text-sm font-semibold uppercase text-gray-900 dark:text-white">Legal</h2>
				<FooterLinkGroup>
					<FooterLink liClass="mb-4" href="https://www.ktechs.xyz/projects/terms-and-conditions/1/xu5y9lkonkgof4j/">Privacy Policy</FooterLink>
					<FooterLink liClass="mb-4" href="https://www.ktechs.xyz/projects/terms-and-conditions/1/xu5y9lkonkgof4j/">Terms & Conditions</FooterLink>
				</FooterLinkGroup>
			</div>
		</div>
	</div>
	<hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
	<div class="sm:flex sm:items-center sm:justify-between">
		<FooterCopyright target="www.ketchs.xyz" href="https://ktechs.xyz" by="Ktechs™" />
		<div class="flex mt-4 space-x-6 sm:justify-center sm:mt-0">
			<!-- <FooterIcon href="/">
          <FacebookSolid class="w-4 h-4 text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white" />
        </FooterIcon>
        <FooterIcon href="/">
          <DiscordSolid class="w-4 h-4 text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white" />
        </FooterIcon>
        <FooterIcon href="/">
          <TwitterSolid class="w-4 h-4 text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white" />
        </FooterIcon>
        <FooterIcon href="/">
          <GithubSolid class="w-4 h-4 text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white" />
        </FooterIcon>
        <FooterIcon href="/">
          <Dribble />
        </FooterIcon> -->
		</div>
	</div>
</Footer>
