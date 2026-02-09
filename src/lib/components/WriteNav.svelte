<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="mt-4 flex items-center gap-2 rounded-full border border-slate-800 bg-slate-800/50 p-1">
	<a
		href="/write"
		class="rounded-full px-4 py-1 text-sm transition-colors {$page.url.pathname === '/write'
			? 'bg-slate-700 text-white'
			: 'text-slate-400 hover:bg-slate-700/50 hover:text-white'}"
	>
		Journal
	</a>
	<a
		href="/characters"
		class="rounded-full px-4 py-1 text-sm transition-colors {$page.url.pathname === '/characters'
			? 'bg-slate-700 text-white'
			: 'text-slate-400 hover:bg-slate-700/50 hover:text-white'}"
	>
		Characters
	</a>
	<a
		href="/scenes"
		class="rounded-full px-4 py-1 text-sm transition-colors {$page.url.pathname === '/scenes'
			? 'bg-slate-700 text-white'
			: 'text-slate-400 hover:bg-slate-700/50 hover:text-white'}"
	>
		Scenes
	</a>
</div>
