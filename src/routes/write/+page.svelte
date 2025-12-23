<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let loading = false;
</script>

<svelte:head>
	<title>Write - Pramari</title>
</svelte:head>

<div class="min-h-screen bg-slate-900 p-6 text-slate-100 md:p-12">
	<div class="mx-auto max-w-4xl space-y-12">
		<header class="flex items-center justify-between border-b border-slate-800 pb-6">
			<div>
				<h1
					class="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-3xl font-bold text-transparent"
				>
					Write Something New
				</h1>
				<p class="mt-2 text-slate-400">Welcome back, {data.user?.name || 'Writer'}</p>
			</div>
			<div class="hidden md:block">
				{#if data.user?.image}
					<img
						src={data.user.image}
						alt="User Profile"
						class="h-10 w-10 rounded-full border-2 border-slate-700"
					/>
				{/if}
			</div>
		</header>

		<main class="grid grid-cols-1 gap-12 lg:grid-cols-2">
			<!-- Writing Section -->
			<section class="space-y-6">
				<div
					class="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 shadow-xl backdrop-blur-sm"
				>
					<h2 class="mb-4 text-xl font-semibold text-emerald-400">Compose</h2>
					<form
						method="POST"
						action="?/save"
						use:enhance={() => {
							loading = true;
							return async ({ update }) => {
								loading = false;
								await update();
							};
						}}
						class="space-y-4"
					>
						<div class="group relative">
							<textarea
								name="text"
								rows="12"
								required
								placeholder="Start writing your thoughts..."
								class="w-full resize-none rounded-xl border border-slate-700 bg-slate-900/50 p-4 text-slate-200 placeholder-slate-500 transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
							></textarea>
							<div
								class="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/10 to-blue-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
							></div>
						</div>

						<div class="flex items-center justify-end gap-4">
							{#if form?.missing}
								<span class="text-sm text-red-400">Please write something first.</span>
							{/if}
							{#if form?.error}
								<span class="text-sm text-red-400">{form.error}</span>
							{/if}
							{#if form?.success}
								<span class="text-sm text-emerald-400">Saved successfully!</span>
							{/if}
							<button
								type="submit"
								disabled={loading}
								class="transform rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-2.5 font-medium text-white shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5 hover:from-emerald-400 hover:to-teal-400 disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
							>
								{loading ? 'Saving...' : 'Save Entry'}
							</button>
						</div>
					</form>
				</div>
			</section>

			<!-- History Section -->
			<section class="space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="text-xl font-semibold text-blue-400">Your Writings</h2>
					<span class="rounded bg-slate-800 px-2 py-1 font-mono text-xs text-slate-500"
						>{data.writings.length} entries</span
					>
				</div>

				<div class="custom-scrollbar max-h-[600px] space-y-4 overflow-y-auto pr-2">
					{#if data.writings.length === 0}
						<div class="rounded-xl border border-dashed border-slate-800 py-12 text-center">
							<p class="text-slate-500">No writings yet. Start passing your thoughts.</p>
						</div>
					{:else}
						{#each data.writings as writing}
							<article
								class="group relative rounded-xl border border-slate-700/30 bg-slate-800/30 p-5 transition-all duration-300 hover:border-slate-600 hover:bg-slate-800/60 hover:shadow-lg hover:shadow-blue-900/10"
							>
								<div class="mb-3 flex items-start justify-between">
									<div class="flex items-center gap-2">
										<div
											class="h-2 w-2 rounded-full bg-blue-500/50 transition-colors group-hover:bg-blue-400"
										></div>
										<time class="font-mono text-xs text-slate-500">
											{new Date(writing.createdAt).toLocaleDateString(undefined, {
												year: 'numeric',
												month: 'short',
												day: 'numeric',
												hour: '2-digit',
												minute: '2-digit'
											})}
										</time>
									</div>
								</div>
								<p
									class="line-clamp-4 whitespace-pre-wrap leading-relaxed text-slate-300 transition-all duration-300 group-hover:line-clamp-none"
								>
									{writing.content}
								</p>
							</article>
						{/each}
					{/if}
				</div>
			</section>
		</main>
	</div>
</div>

<style>
	/* Custom scrollbar for webkit */
	.custom-scrollbar::-webkit-scrollbar {
		width: 6px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: rgba(15, 23, 42, 0.5);
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: rgba(71, 85, 105, 0.5);
		border-radius: 3px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: rgba(94, 110, 133, 0.8);
	}
</style>
