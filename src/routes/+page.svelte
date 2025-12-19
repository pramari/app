<script>
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { backOut, cubicOut } from 'svelte/easing';

	const API_BASE = '/api/v2/pages'; // Using proxy
	const ROOT_ID = 79;

	let currentPage = null;
	let children = [];
	let history = [];
	let loading = true;
	let error = null;

	async function fetchPage(id) {
		loading = true;
		error = null;
		try {
			// Fetch page details
			const pageRes = await fetch(`${API_BASE}/${id}/`);
			if (!pageRes.ok) throw new Error('Failed to fetch page details');
			const pageData = await pageRes.json();

			// Fetch children
			const childrenRes = await fetch(`${API_BASE}/?child_of=${id}`);
			if (!childrenRes.ok) throw new Error('Failed to fetch children');
			const childrenData = await childrenRes.json();

			currentPage = pageData;
			children = childrenData.items || [];
		} catch (e) {
			error = e.message;
		} finally {
			loading = false;
		}
	}

	async function navigateTo(id) {
		if (currentPage) {
			history = [...history, currentPage];
		}
		await fetchPage(id);
	}

	async function navigateBack() {
		if (history.length > 0) {
			const previous = history.pop();
			history = [...history]; // Trigger reactivity
			await fetchPage(previous.id);
		}
	}

	onMount(() => {
		fetchPage(ROOT_ID);
	});
</script>

<svelte:head>
	<title>{currentPage ? currentPage.title : 'Wagtail Navigator'}</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<link
		href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<main
	class="min-h-screen overflow-hidden bg-[#0a0a0c] font-['Outfit'] text-white selection:bg-blue-500/30"
>
	<!-- Background blobs -->
	<div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
		<div
			class="absolute -left-[10%] -top-[10%] h-[40%] w-[40%] animate-pulse rounded-full bg-blue-600/10 blur-[120px]"
		></div>
		<div
			class="absolute -right-[10%] top-[20%] h-[35%] w-[35%] animate-pulse rounded-full bg-purple-600/10 blur-[120px]"
			style="animation-delay: -2s"
		></div>
		<div
			class="absolute -bottom-[10%] left-[20%] h-[30%] w-[30%] animate-pulse rounded-full bg-emerald-600/10 blur-[120px]"
			style="animation-delay: -1s"
		></div>
	</div>

	<div class="relative mx-auto max-w-5xl px-6 py-12 lg:py-24">
		<!-- Header / Navigation -->
		<header class="mb-12" in:fade={{ duration: 800 }}>
			<div class="mb-6 flex items-center gap-4">
				{#if history.length > 0}
					<button
						on:click={navigateBack}
						class="group flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition-all duration-300 hover:border-white/20 hover:bg-white/10"
						aria-label="Go back"
					>
						<svg
							class="h-5 w-5 text-white/50 transition-all group-hover:-translate-x-1 group-hover:text-white"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 19l-7-7 7-7"
							/>
						</svg>
					</button>
				{/if}
				<div class="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent"></div>
			</div>

			{#if currentPage}
				{#key currentPage.id}
					<div in:fly={{ y: 20, duration: 600, easing: cubicOut }}>
						<h1
							class="mb-4 bg-gradient-to-br from-white via-white to-white/40 bg-clip-text text-5xl font-semibold tracking-tight text-transparent lg:text-7xl"
						>
							{currentPage.title}
						</h1>
						{#if currentPage.meta && currentPage.meta.search_description}
							<p class="max-w-2xl text-lg font-light leading-relaxed text-white/60 lg:text-xl">
								{currentPage.meta.search_description}
							</p>
						{/if}
					</div>
				{/key}
			{/if}
		</header>

		<!-- Content -->
		{#if loading && !currentPage}
			<div class="flex flex-col items-center justify-center gap-4 py-20" in:fade>
				<div
					class="h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-white/80"
				></div>
				<p class="animate-pulse text-sm uppercase tracking-widest text-white/40">
					Bridging connections...
				</p>
			</div>
		{:else if error}
			<div class="rounded-3xl border border-red-500/20 bg-red-500/5 p-8 text-red-400">
				<p class="mb-2 text-lg font-medium">Something went wrong</p>
				<p class="opacity-70">{error}</p>
				<button
					on:click={() => fetchPage(currentPage ? currentPage.id : ROOT_ID)}
					class="mt-4 rounded-xl bg-red-500/10 px-6 py-2 transition-colors hover:bg-red-500/20"
				>
					Try Again
				</button>
			</div>
		{:else}
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2" in:fade={{ duration: 400, delay: 200 }}>
				{#each children as child (child.id)}
					<button
						on:click={() => navigateTo(child.id)}
						class="group relative block w-full overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] p-8 text-left transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06]"
					>
						<!-- Hover highlight -->
						<div
							class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
						></div>

						<div class="relative z-10">
							<div class="mb-4 flex items-start justify-between">
								<div
									class="rounded-2xl border border-white/5 bg-white/5 p-3 transition-colors group-hover:border-white/10"
								>
									<svg
										class="h-6 w-6 text-white/40 transition-colors group-hover:text-white/90"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
										/>
									</svg>
								</div>
								<div
									class="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
								>
									<svg
										class="h-4 w-4 text-white"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 5l7 7-7 7"
										/>
									</svg>
								</div>
							</div>

							<h3 class="mb-2 text-2xl font-medium transition-colors group-hover:text-white">
								{child.title}
							</h3>
							<p class="text-sm font-light uppercase tracking-widest text-white/40">
								{child.meta.type.split('.').pop()}
							</p>
						</div>
					</button>
				{/each}

				{#if children.length === 0 && !loading && currentPage}
					<div
						class="col-span-full rounded-[40px] border-2 border-dashed border-white/5 py-20 text-center"
						in:fade
					>
						<div
							class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/5"
						>
							<svg
								class="h-8 w-8 text-white/20"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
								/>
							</svg>
						</div>
						<h3 class="mb-2 text-xl text-white/60">No deeper paths found</h3>
						<p class="font-light text-white/30">
							This page is a final destination in the current journey.
						</p>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</main>

<style>
	:global(body) {
		margin: 0;
		background: #0a0a0c;
		overflow-x: hidden;
	}

	.animate-pulse {
		animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 0.1;
		}
		50% {
			opacity: 0.2;
		}
	}
</style>
