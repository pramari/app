<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	import WriteNav from '$lib/components/WriteNav.svelte';

	export let data: PageData;
	export let form: ActionData;

	let loading = false;

	// Form state
	let characterId: string | undefined = undefined;
	let characterName = '';
	let characterDescription = '';
	let isEditing = false;

	function startEditing(character: { id: string; name: string; description: string }) {
		characterId = character.id;
		characterName = character.name;
		characterDescription = character.description;
		isEditing = true;
	}

	function resetForm() {
		characterId = undefined;
		characterName = '';
		characterDescription = '';
		isEditing = false;
	}
</script>

<svelte:head>
	<title>Characters - Pramari</title>
</svelte:head>

<div class="min-h-screen bg-slate-900 p-6 text-slate-100 md:p-12">
	<div class="mx-auto max-w-4xl space-y-12">
		<header class="flex items-center justify-between border-b border-slate-800 pb-6">
			<div>
				<h1
					class="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-3xl font-bold text-transparent"
				>
					Your Characters
				</h1>
				<p class="mt-2 text-slate-400">Manage your story's cast.</p>
				<WriteNav />
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
			<!-- Character Form -->
			<section class="space-y-6">
				<div
					class="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 shadow-xl backdrop-blur-sm"
				>
					<h2 class="mb-4 text-xl font-semibold text-indigo-400">
						{isEditing ? 'Edit Character' : 'Create New Character'}
					</h2>
					<form
						method="POST"
						action="?/save"
						use:enhance={() => {
							loading = true;
							return async ({ update }) => {
								await update();
								loading = false;
								if (form?.success) {
									resetForm();
								}
							};
						}}
						class="space-y-4"
					>
						<input type="hidden" name="id" value={characterId} />
						<div>
							<label for="name" class="mb-2 block text-sm font-medium text-slate-400">Name</label>
							<input
								type="text"
								name="name"
								id="name"
								required
								placeholder="Character's name"
								bind:value={characterName}
								class="w-full rounded-xl border border-slate-700 bg-slate-900/50 p-4 text-slate-200 placeholder-slate-500 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
							/>
						</div>
						<div>
							<label for="description" class="mb-2 block text-sm font-medium text-slate-400"
								>Description</label
							>
							<textarea
								name="description"
								id="description"
								rows="6"
								placeholder="Character's description, backstory, etc."
								bind:value={characterDescription}
								class="w-full resize-none rounded-xl border border-slate-700 bg-slate-900/50 p-4 text-slate-200 placeholder-slate-500 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
							></textarea>
						</div>

						<div class="flex items-center justify-end gap-4 pt-2">
							{#if isEditing}
								<button
									type="button"
									on:click={resetForm}
									class="rounded-lg px-6 py-2.5 text-sm font-medium text-slate-400 transition-all hover:text-slate-200"
								>
									Cancel
								</button>
							{/if}
							<button
								type="submit"
								disabled={loading}
								class="transform rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-2.5 font-medium text-white shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5 hover:from-indigo-400 hover:to-purple-400 disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
							>
								{loading ? 'Saving...' : 'Save Character'}
							</button>
						</div>
					</form>
				</div>
			</section>

			<!-- Characters List -->
			<section class="space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="text-xl font-semibold text-purple-400">Your Cast</h2>
					<span class="rounded bg-slate-800 px-2 py-1 font-mono text-xs text-slate-500"
						>{data.characters.length} characters</span
					>
				</div>

				<div class="custom-scrollbar max-h-[600px] space-y-4 overflow-y-auto pr-2">
					{#if data.characters.length === 0}
						<div class="rounded-xl border border-dashed border-slate-800 py-12 text-center">
							<p class="text-slate-500">No characters yet. Create one to get started.</p>
						</div>
					{:else}
						{#each data.characters as character (character.id)}
							<article class="rounded-xl border border-slate-700/30 bg-slate-800/30 p-5">
								<h3 class="font-semibold text-indigo-300">{character.name}</h3>
								<p class="mt-2 whitespace-pre-wrap text-sm text-slate-400">
									{character.description || 'No description.'}
								</p>
								<div class="mt-4 flex items-center justify-end gap-2">
									<button
										on:click={() => startEditing(character)}
										class="rounded px-3 py-1 text-xs font-medium text-slate-400 transition-colors hover:bg-slate-700 hover:text-indigo-300"
									>
										Edit
									</button>
									<form method="POST" action="?/delete" use:enhance>
										<input type="hidden" name="id" value={character.id} />
										<button
											type="submit"
											class="rounded px-3 py-1 text-xs font-medium text-slate-400 transition-colors hover:bg-slate-700 hover:text-red-400"
										>
											Delete
										</button>
									</form>
								</div>
							</article>
						{/each}
					{/if}
				</div>
			</section>
		</main>
	</div>
</div>

<style>
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
