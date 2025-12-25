<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	import { tick } from 'svelte';
	import WriteNav from '$lib/components/WriteNav.svelte';

	export let data: PageData;
	export let form: ActionData;

	let loading = false;

	// Form state
	let sceneId: string | undefined = undefined;
	let sceneTitle = '';
	let sceneContent = '';
	let isEditing = false;

	function startEditing(scene: { id: string; title: string; content: string }) {
		sceneId = scene.id;
		sceneTitle = scene.title;
		sceneContent = scene.content;
		isEditing = true;
	}

	function resetForm() {
		sceneId = undefined;
		sceneTitle = '';
		sceneContent = '';
		isEditing = false;
	}

	// For @-mention
	let showMentions = false;
	let mentionQuery = '';
	let filteredCharacters: { id: string; name: string }[] = [];
	let mentionPosition = { top: 0, left: 0 };
	let textareaEl: HTMLTextAreaElement;

	function handleTextareaInput(e: Event) {
		const textarea = e.target as HTMLTextAreaElement;
		const cursorPos = textarea.selectionStart;
		const textUpToCursor = textarea.value.substring(0, cursorPos);
		const mentionMatch = textUpToCursor.match(/@(\w*)$/);

		if (mentionMatch) {
			showMentions = true;
			mentionQuery = mentionMatch[1].toLowerCase();
			filteredCharacters = data.characters.filter((c) =>
				c.name.toLowerCase().includes(mentionQuery)
			);
			// This is a simplified way to get cursor position.
			// A real implementation might need a library to be more accurate.
			const rect = textarea.getBoundingClientRect();
			mentionPosition = { top: rect.top + 30, left: rect.left + 20 };
		} else {
			showMentions = false;
		}
	}

	function selectMention(characterName: string) {
		const textarea = textareaEl;
		const cursorPos = textarea.selectionStart;
		const textUpToCursor = textarea.value.substring(0, cursorPos);
		const mentionMatch = textUpToCursor.match(/@(\w*)$/);

		if (mentionMatch) {
			const mentionStartIndex = mentionMatch.index || 0;
			const textBefore = textarea.value.substring(0, mentionStartIndex);
			const textAfter = textarea.value.substring(cursorPos);
			sceneContent = `${textBefore}@${characterName} ${textAfter}`;
			showMentions = false;

			tick().then(() => {
				textarea.focus();
				const newCursorPos = mentionStartIndex + characterName.length + 2;
				textarea.setSelectionRange(newCursorPos, newCursorPos);
			});
		}
	}

	function renderContent(content: string) {
		if (!data.characters) return content;
		const characterNames = data.characters.map((c) => c.name);
		if (characterNames.length === 0) return content;
		// A simple but potentially buggy regex. A more robust solution would be better.
		const regex = new RegExp(`@(${characterNames.join('|')})`, 'g');
		return content.replace(regex, '<strong class="text-teal-300">@$1</strong>');
	}
</script>

<svelte:head>
	<title>Scenes - Pramari</title>
</svelte:head>

<div class="min-h-screen bg-slate-900 p-6 text-slate-100 md:p-12">
	<div class="mx-auto max-w-4xl space-y-12">
		<header class="flex items-center justify-between border-b border-slate-800 pb-6">
			<div>
				<h1
					class="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-3xl font-bold text-transparent"
				>
					Your Scenes
				</h1>
				<p class="mt-2 text-slate-400">Write and organize your story's scenes.</p>
				<WriteNav />
			</div>
		</header>

		<main class="grid grid-cols-1 gap-12 lg:grid-cols-2">
			<!-- Scene Form -->
			<section class="space-y-6">
				<div
					class="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 shadow-xl backdrop-blur-sm"
				>
					<h2 class="mb-4 text-xl font-semibold text-sky-400">
						{isEditing ? 'Edit Scene' : 'Create New Scene'}
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
						<input type="hidden" name="id" value={sceneId} />
						<div>
							<label for="title" class="mb-2 block text-sm font-medium text-slate-400">Title</label>
							<input
								type="text"
								name="title"
								id="title"
								required
								placeholder="Scene title or summary"
								bind:value={sceneTitle}
								class="w-full rounded-xl border border-slate-700 bg-slate-900/50 p-4 text-slate-200 placeholder-slate-500 transition-all focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
							/>
						</div>
						<div class="relative">
							<label for="content" class="mb-2 block text-sm font-medium text-slate-400"
								>Content</label
							>
							{#if data.characters.length === 0}
								<p class="mb-2 text-sm text-slate-500">
									<a href="/characters" class="text-sky-400 hover:underline">Create a character</a>
									to use @-mentions.
								</p>
							{/if}
							<textarea
								name="content"
								id="content"
								rows="10"
								placeholder="Write your scene here... You can @-mention characters."
								bind:value={sceneContent}
								bind:this={textareaEl}
								on:input={handleTextareaInput}
								class="w-full resize-none rounded-xl border border-slate-700 bg-slate-900/50 p-4 text-slate-200 placeholder-slate-500 transition-all focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
							></textarea>

							{#if showMentions && filteredCharacters.length > 0}
								<div
									class="absolute z-10 mt-1 w-full rounded-md border border-slate-600 bg-slate-800 text-white shadow-lg"
									style="top: {mentionPosition.top}px; left: {mentionPosition.left}px;"
								>
									<ul class="max-h-40 overflow-y-auto">
										{#each filteredCharacters as char}
											<li>
												<button
													type="button"
													class="w-full cursor-pointer px-4 py-2 text-left hover:bg-slate-700"
													on:mousedown|preventDefault={() => selectMention(char.name)}
												>
													{char.name}
												</button>
											</li>
										{/each}
									</ul>
								</div>
							{/if}
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
								class="transform rounded-lg bg-gradient-to-r from-sky-500 to-teal-500 px-6 py-2.5 font-medium text-white shadow-lg shadow-sky-500/20 transition-all hover:-translate-y-0.5 hover:from-sky-400 hover:to-teal-400 disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
							>
								{loading ? 'Saving...' : 'Save Scene'}
							</button>
						</div>
					</form>
				</div>
			</section>

			<!-- Scenes List -->
			<section class="space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="text-xl font-semibold text-teal-400">Your Scenes</h2>
					<span class="rounded bg-slate-800 px-2 py-1 font-mono text-xs text-slate-500"
						>{data.scenes.length} scenes</span
					>
				</div>

				<div class="custom-scrollbar max-h-[600px] space-y-4 overflow-y-auto pr-2">
					{#if data.scenes.length === 0}
						<div class="rounded-xl border border-dashed border-slate-800 py-12 text-center">
							<p class="text-slate-500">No scenes yet. Create one to get started.</p>
						</div>
					{:else}
						{#each data.scenes as scene (scene.id)}
							<article class="rounded-xl border border-slate-700/30 bg-slate-800/30 p-5">
								<h3 class="font-semibold text-sky-300">{scene.title}</h3>
								<div class="prose prose-invert mt-2 text-sm text-slate-400">
									{@html renderContent(scene.content || '')}
								</div>
								<div class="mt-4 flex items-center justify-end gap-2">
									<button
										on:click={() => startEditing(scene)}
										class="rounded px-3 py-1 text-xs font-medium text-slate-400 transition-colors hover:bg-slate-700 hover:text-sky-300"
									>
										Edit
									</button>
									<form method="POST" action="?/delete" use:enhance>
										<input type="hidden" name="id" value={scene.id} />
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
	.prose {
		max-width: none;
	}
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
