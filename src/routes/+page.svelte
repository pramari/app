<script>
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { backOut, cubicOut } from 'svelte/easing';

	// Use absolute URL for production, relative for local dev with proxy
	const API_BASE =
		typeof window !== 'undefined' && window.location.hostname === 'localhost'
			? '/api/v2/pages'
			: 'https://pramari.de/api/v2/pages';

	const ROOT_ID = 79;

	/** @type {any} */
	let currentPage = null;
	/** @type {any[]} */
	let children = [];
	/** @type {any[]} */
	let history = [];
	let loading = true;
	/** @type {string|null} */
	let error = null;

	/** @param {any} id */
	async function fetchPage(id) {
		loading = true;
		error = null;
		try {
			// Fetch page details
			const pageRes = await fetch(`${API_BASE}/${id}/`);
			if (!pageRes.ok) throw new Error('Failed to fetch page details');
			const pageData = await pageRes.json();

			// Fetch children with all fields
			const childrenRes = await fetch(`${API_BASE}/?child_of=${id}&fields=*`);
			if (!childrenRes.ok) throw new Error('Failed to fetch children');
			const childrenData = await childrenRes.json();

			currentPage = pageData;
			children = childrenData.items || [];
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		} finally {
			loading = false;
		}
	}

	/** @param {any} id */
	async function navigateTo(id) {
		if (currentPage) {
			history = [...history, currentPage];
		}
		await fetchPage(id);
	}

	/** @param {number} index */
	async function navigateToBreadcrumb(index) {
		const targetPage = history[index];
		history = history.slice(0, index);
		await fetchPage(targetPage.id);
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
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<main
	class="min-h-screen overflow-hidden bg-[var(--bg-main)] font-['Outfit'] text-[var(--text-main)] transition-colors duration-300 selection:bg-blue-500/30"
>
	<!-- Background blobs -->
	<div
		class="pointer-events-none fixed inset-0 -z-10 overflow-hidden opacity-[var(--blob-opacity)]"
	>
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
			<!-- Breadcrumbs -->
			<nav
				class="mb-8 flex flex-wrap items-center gap-2 text-sm font-light text-[var(--text-muted)]"
			>
				<button
					on:click={() => {
						history = [];
						fetchPage(ROOT_ID);
					}}
					class="transition-colors hover:text-[var(--text-main)]"
				>
					Home
				</button>

				{#each history as step, i}
					{#if step.id !== ROOT_ID}
						<span class="opacity-30">/</span>
						<button
							on:click={() => navigateToBreadcrumb(i)}
							class="transition-colors hover:text-[var(--text-main)]"
						>
							{step.title}
						</button>
					{/if}
				{/each}

				{#if currentPage && currentPage.id !== ROOT_ID}
					<span class="opacity-30">/</span>
					<span class="font-medium text-[var(--text-main)]">{currentPage.title}</span>
				{/if}
			</nav>

			<div class="mb-6 flex items-center gap-4">
				{#if history.length > 0}
					<button
						on:click={navigateBack}
						class="group flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--nav-border)] bg-[var(--card-bg)] transition-all duration-300 hover:border-[var(--nav-border)] hover:bg-[var(--card-hover-bg)]"
						aria-label="Go back"
					>
						<svg
							class="h-5 w-5 text-[var(--text-muted)] transition-all group-hover:-translate-x-1 group-hover:text-[var(--text-main)]"
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
				<div class="h-px flex-1 bg-gradient-to-r from-[var(--nav-border)] to-transparent"></div>
			</div>

			{#if currentPage}
				{#key currentPage.id}
					<div in:fly={{ y: 20, duration: 600, easing: cubicOut }}>
						<h1
							class="mb-4 bg-gradient-to-br from-[var(--text-main)] via-[var(--text-main)] to-[var(--text-muted)] bg-clip-text text-5xl font-semibold tracking-tight text-transparent lg:text-7xl"
						>
							{currentPage.title}
						</h1>

						{#if currentPage.meta?.type === 'pages.HomePage'}
							{#if currentPage.intro}
								<div
									class="prose-luxury mb-8 max-w-2xl text-xl font-light leading-relaxed text-[var(--text-muted)] lg:text-2xl"
								>
									{@html currentPage.intro}
								</div>
							{/if}
							{#if currentPage.body}
								<div
									class="prose-luxury text-[var(--text-main)]/80 mb-12 max-w-3xl text-lg font-light leading-relaxed"
								>
									{@html currentPage.body}
								</div>
							{/if}
						{:else if currentPage.meta?.search_description}
							<p
								class="max-w-2xl text-lg font-light leading-relaxed text-[var(--text-muted)] lg:text-xl"
							>
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
					class="h-12 w-12 animate-spin rounded-full border-2 border-[var(--nav-border)] border-t-[var(--text-main)]"
				></div>
				<p class="animate-pulse text-sm uppercase tracking-widest text-[var(--text-muted)]">
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
		{:else if children.length > 0}
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2" in:fade={{ duration: 400, delay: 200 }}>
				{#each children as child (child.id)}
					<button
						on:click={() => navigateTo(child.id)}
						class="group relative block w-full overflow-hidden rounded-[32px] border border-[var(--nav-border)] bg-[var(--card-bg)] p-8 text-left transition-all duration-500 hover:-translate-y-1 hover:border-[var(--nav-border)] hover:bg-[var(--card-hover-bg)]"
					>
						<!-- Hover highlight -->
						<div
							class="absolute inset-0 bg-gradient-to-br from-[var(--text-main)] to-transparent opacity-0 transition-opacity group-hover:opacity-[0.03]"
						></div>

						<div class="relative z-10">
							<div class="mb-4 flex items-start justify-between">
								<div
									class="rounded-2xl border border-[var(--nav-border)] bg-[var(--card-bg)] p-3 transition-colors group-hover:border-[var(--nav-border)]"
								>
									<svg
										class="h-6 w-6 text-[var(--text-muted)] transition-colors group-hover:text-[var(--text-main)]"
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
									class="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--card-bg)] opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
								>
									<svg
										class="h-4 w-4 text-[var(--text-main)]"
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

							{#if child.card_title}
								<div
									class="mb-2 text-2xl font-medium transition-colors group-hover:text-[var(--text-main)]"
								>
									{@html child.card_title}
								</div>
							{:else}
								<h3
									class="mb-2 text-2xl font-medium transition-colors group-hover:text-[var(--text-main)]"
								>
									{child.title}
								</h3>
							{/if}

							{#if child.card_subtitle}
								<div class="mb-2 text-sm font-light leading-relaxed text-[var(--text-muted)]">
									{@html child.card_subtitle}
								</div>
							{/if}

							<p
								class="text-xs font-light uppercase tracking-widest text-[var(--text-muted)] opacity-60"
							>
								{child.meta.type.split('.').pop()}
							</p>
						</div>
					</button>
				{/each}
			</div>
		{:else if !loading && currentPage}
			{#if history.length > 0}
				<div class="flex justify-center py-12" in:fade>
					<button
						on:click={navigateBack}
						class="group flex items-center gap-3 rounded-full border border-[var(--nav-border)] bg-[var(--card-bg)] px-8 py-4 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--nav-border)] hover:bg-[var(--card-hover-bg)]"
					>
						<div class="rounded-full bg-[var(--bg-main)] p-2 transition-colors">
							<svg
								class="h-5 w-5 text-[var(--text-main)] transition-transform group-hover:-translate-y-1"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M5 10l7-7m0 0l7 7m-7-7v18"
								/>
							</svg>
						</div>
						<span class="text-lg font-medium">Return Up</span>
					</button>
				</div>
			{:else}
				<div class="h-px bg-gradient-to-r from-[var(--nav-border)] to-transparent opacity-50"></div>
			{/if}
		{/if}
	</div>
</main>

<style>
	:global(body) {
		margin: 0;
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

	.prose-luxury :global(p) {
		margin-bottom: 1.5rem;
	}

	.prose-luxury :global(p:last-child) {
		margin-bottom: 0;
	}

	.prose-luxury :global(a) {
		color: #3b82f6;
		text-decoration: underline;
		text-underline-offset: 4px;
		transition: opacity 0.2s;
	}

	.prose-luxury :global(a:hover) {
		opacity: 0.8;
	}
</style>
