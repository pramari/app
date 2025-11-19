<script>
	import '../app.css';
	let { children } = $props();
</script>

<header>
	<nav>
		<a href="/">Home</a>
	</nav>
</header>

<main>
	{@render children()}
</main>

<style>
	header {
		background-color: #f8f9fa;
		padding: 1rem;
		border-bottom: 1px solid #e9ecef;
	}
	nav {
		display: flex;
		gap: 1rem;
	}
	a {
		text-decoration: none;
		color: #007bff;
	}
	main {
		padding: 1rem;
	}
</style>
