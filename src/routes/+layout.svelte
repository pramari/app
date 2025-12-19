<script>
	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="app-container">
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
		background: #0a0a0c;
		color: white;
		font-family: 'Outfit', sans-serif;
	}

	.app-container {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.glass-nav {
		position: sticky;
		top: 0;
		z-index: 50;
		background: rgba(10, 10, 12, 0.7);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border-bottom: 1px solid rgba(255, 255, 255, 0.05);
		padding: 0.75rem 1.5rem;
		display: flex;
		justify-content: center;
	}

	.nav-content {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.05);
		padding: 0.4rem;
		border-radius: 99rem;
	}

	.nav-link {
		color: rgba(255, 255, 255, 0.5);
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
	}

	.nav-link:hover {
		color: white;
		background: rgba(255, 255, 255, 0.05);
	}

	.nav-icon {
		font-size: 0.8rem;
		opacity: 0.8;
	}

	.nav-divider {
		width: 1px;
		height: 1.25rem;
		background: rgba(255, 255, 255, 0.1);
	}

	main {
		flex: 1;
	}
</style>
