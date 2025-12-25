<script>
	import { onMount } from 'svelte';
	import '../app.css';

	let { children } = $props();
	let theme = $state('dark');

	onMount(() => {
		const savedTheme = localStorage.getItem('theme');
		if (savedTheme) {
			theme = savedTheme;
		} else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
			theme = 'light';
		}
	});

	function toggleTheme() {
		theme = theme === 'dark' ? 'light' : 'dark';
		localStorage.setItem('theme', theme);
	}
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="app-container {theme}">
	<header class="glass-nav">
		<nav class="nav-content">
			<a href="/" class="nav-link">
				<span class="nav-icon">◈</span>
				Home
			</a>
			<div class="nav-divider"></div>
			<a href="/chat" class="nav-link">
				<span class="nav-icon">✦</span>
				Chat
			</a>
			<div class="nav-divider"></div>
			<a href="/write" class="nav-link">
				<span class="nav-icon">✎</span>
				Write
			</a>
			<div class="nav-divider"></div>
			<button class="theme-toggle" onclick={toggleTheme} aria-label="Toggle theme">
				{#if theme === 'dark'}
					<span class="nav-icon">☼</span>
				{:else}
					<span class="nav-icon">☾</span>
				{/if}
			</button>
		</nav>
	</header>

	<main>
		{@render children()}
	</main>
</div>

<style>
	:global(html, body) {
		margin: 0;
		padding: 0;
		transition:
			background-color 0.3s ease,
			color 0.3s ease;
	}

	.app-container {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background: var(--bg-main);
		color: var(--text-main);
		font-family: 'Outfit', sans-serif;
		transition: all 0.3s ease;
	}

	.dark {
		--bg-main: #0a0a0c;
		--text-main: #ffffff;
		--text-muted: rgba(255, 255, 255, 0.5);
		--nav-bg: rgba(10, 10, 12, 0.7);
		--nav-border: rgba(255, 255, 255, 0.05);
		--card-bg: rgba(255, 255, 255, 0.03);
		--card-hover-bg: rgba(255, 255, 255, 0.06);
		--accent-glow: rgba(59, 130, 246, 0.1);
		--blob-opacity: 1;
	}

	.light {
		--bg-main: #ffffff;
		--text-main: #1a1a1e;
		--text-muted: rgba(0, 0, 0, 0.5);
		--nav-bg: rgba(255, 255, 255, 0.7);
		--nav-border: rgba(0, 0, 0, 0.08);
		--card-bg: rgba(0, 0, 0, 0.03);
		--card-hover-bg: rgba(0, 0, 0, 0.05);
		--accent-glow: rgba(59, 130, 246, 0.05);
		--blob-opacity: 0.4;
	}

	.glass-nav {
		position: sticky;
		top: 0;
		z-index: 50;
		background: var(--nav-bg);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border-bottom: 1px solid var(--nav-border);
		padding: 0.75rem 1.5rem;
		display: flex;
		justify-content: center;
	}

	.nav-content {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: var(--card-bg);
		border: 1px solid var(--nav-border);
		padding: 0.4rem;
		border-radius: 99rem;
	}

	.nav-link,
	.theme-toggle {
		color: var(--text-muted);
		text-decoration: none;
		font-size: 0.9rem;
		font-weight: 400;
		letter-spacing: 0.02em;
		padding: 0.5rem 1.25rem;
		border-radius: 99rem;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: transparent;
		border: none;
		cursor: pointer;
	}

	.nav-link:hover,
	.theme-toggle:hover {
		color: var(--text-main);
		background: var(--card-hover-bg);
	}

	.nav-icon {
		font-size: 0.8rem;
		opacity: 0.8;
	}

	.nav-divider {
		width: 1px;
		height: 1.25rem;
		background: var(--nav-border);
	}

	main {
		flex: 1;
	}
</style>
