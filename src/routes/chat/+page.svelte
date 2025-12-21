<script>
	import { onMount, onDestroy } from 'svelte';
	import { createClient, IndexedDBStore, IndexedDBCryptoStore } from 'matrix-js-sdk';
	import { on } from 'svelte/events';

	let matrixClient;
	let currentRoomId;
	let userId = '';
	let messages = [];
	let messageInput = '';
	let isLoginButtonDisabled = true;
	let isChatDisabled = true;

	const homeserverUrl = 'https://matrix.pramari.de';
	const roomAlias = '#sauna:pramari.de';

	onMount(() => {
		handleSsoCallback();
	});

	onDestroy(() => {
		leaveRoomOnExit();
	});

	function logToUI(message, isChatMessage = false) {
		messages = [...messages, { text: message, isChatMessage }];
		console.log(message);
	}

	function getBaseRedirectUrl() {
		return window.location.origin + window.location.pathname;
	}

	async function initiateSsoLogin() {
		logToUI('Redirecting for SSO login...');
		localStorage.setItem('sso_roomAlias', roomAlias);

		const redirectUrl = getBaseRedirectUrl();
		const ssoRedirectEndpoint =
			homeserverUrl.replace(/\/$/, '') +
			'/_matrix/client/v3/login/sso/redirect?redirectUrl=' +
			encodeURIComponent(redirectUrl);

		window.location.href = ssoRedirectEndpoint;
	}

	async function handleSsoCallback() {
		const urlParams = new URLSearchParams(window.location.search);
		const loginToken = urlParams.get('loginToken');
		const storedRoomAlias = localStorage.getItem('sso_roomAlias');

		if (loginToken && storedRoomAlias) {
			logToUI('SSO login token received. Completing login...');
			const cleanUrl = getBaseRedirectUrl();
			window.history.replaceState({}, document.title, cleanUrl);
			localStorage.removeItem('sso_roomAlias');

			await initializeMatrixClient(homeserverUrl, loginToken, storedRoomAlias);
		} else {
			logToUI('Ready to login via SSO.');
			isLoginButtonDisabled = false;
		}
	}

	async function initializeMatrixClient(homeserverUrl, loginToken, roomAliasToJoin) {
		try {
			logToUI('Creating Matrix client...');
			matrixClient = createClient({
				baseUrl: homeserverUrl,
				store: new IndexedDBStore({ indexedDB: window.indexedDB, dbName: 'matrix-js-sdk' }),
				cryptoStore: new IndexedDBCryptoStore(window.indexedDB, 'matrix-js-sdk-crypto'),
				deviceId: 'browser'
			});

			logToUI('Logging in with SSO token...');
			const loginResponse = await matrixClient.login('m.login.token', { token: loginToken });
			userId = loginResponse.user_id;
			const deviceId = loginResponse.device_id;
			await matrixClient.initRustCrypto();

			logToUI(`Logged in as ${userId} with deviceId ${deviceId}`);

			matrixClient.on('crypto.verification.request', (request) => {
				logToUI(
					`Received verification request from ${request.otherUserId}. In a real app you would now handle this request.`
				);
				console.log('Verification request:', request);
			});

			matrixClient.once('sync', function (state) {
				if (state === 'PREPARED') {
					logToUI('Client synced. You can now send/receive messages.');
					const room = matrixClient.getRoom(currentRoomId);
					if (room) {
						room.timeline.forEach((event) => {
							if (event.getType() === 'm.room.message' && event.getContent().body) {
								logToUI(`${event.getSender()}: ${event.getContent().body}`, true);
							}
						});
					}
				} else if (state === 'ERROR') {
					logToUI('Sync error occurred.');
				}
			});

			isLoginButtonDisabled = true;
			isChatDisabled = false;

			const room = await matrixClient.joinRoom(roomAliasToJoin);
			currentRoomId = room.roomId;

			logToUI('Matrix client initialized and room joined.');

			await matrixClient.startClient({ initialSyncLimit: 10 });

			matrixClient.on('Room.timeline', (event, room, toStartOfTimeline) => {
				if (toStartOfTimeline) {
					return;
				}
				if (event.getType() !== 'm.room.message') {
					return;
				}
				if (room.roomId !== currentRoomId) {
					return;
				}
				const sender = event.getSender();
				const message = event.getContent().body;
				logToUI(`${sender}: ${message}`, true);
			});
		} catch (error) {
			logToUI(`Error during SSO login or chat setup: ${error.message}`);
			console.error('SSO Login/Chat Setup Error:', error);
			isLoginButtonDisabled = false;
			isChatDisabled = true;
		}
	}

	async function leaveRoomOnExit() {
		if (matrixClient && currentRoomId) {
			await matrixClient.leave(currentRoomId);
		}
	}

	async function clearIndexedDB() {
		if (typeof window !== 'undefined' && window.indexedDB) {
			const dbs = await window.indexedDB.databases();
			for (const db of dbs) {
				window.indexedDB.deleteDatabase(db.name);
			}
			logToUI('IndexedDB cleared.');
		}
	}

	async function logout() {
		if (matrixClient) {
			await matrixClient.logout();
			await clearIndexedDB(); // Clears IndexedDB after logout
			logToUI('Logged out.');
			isLoginButtonDisabled = false;
			isChatDisabled = true;
			window.location.reload();
		}
	}

	async function sendMessage() {
		if (!matrixClient || !currentRoomId) {
			alert('Client not started or Room not joined.');
			return;
		}
		if (!messageInput.trim()) {
			return;
		}

		const content = {
			body: messageInput,
			msgtype: 'm.text'
		};

		try {
			await matrixClient.sendEvent(currentRoomId, 'm.room.message', content, '');
			messageInput = '';
		} catch (error) {
			logToUI(`Error sending message: ${error.message}`);
			console.error('Error in sendMessage:', error);
		}
	}
</script>

<nav
	class="mb-6 flex items-center justify-between rounded-2xl border border-[var(--nav-border)] bg-[var(--card-bg)] p-4"
>
	<div class="flex items-center">
		<label for="userIdInput" class="mr-2 font-medium text-[var(--text-muted)]">User ID:</label>
		<input
			type="text"
			id="userIdInput"
			placeholder="Will be filled after SSO"
			readonly
			bind:value={userId}
			class="rounded-md border border-[var(--nav-border)] bg-[var(--bg-main)] p-1 px-3 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500"
		/>
	</div>
	<div class="flex space-x-2">
		<button
			on:click={initiateSsoLogin}
			disabled={isLoginButtonDisabled}
			class="rounded-xl bg-blue-600 px-4 py-2 text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400/20 disabled:text-gray-500"
		>
			Login
		</button>
		<button
			on:click={logout}
			disabled={isChatDisabled}
			class="rounded-xl bg-red-600/80 px-4 py-2 text-white transition-all hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-gray-400/20 disabled:text-gray-500"
		>
			Logout
		</button>
	</div>
</nav>

<div
	id="messages"
	class="custom-scrollbar rounded-3xl border border-[var(--nav-border)] bg-[var(--card-bg)]"
>
	{#each messages as msg}
		<div class="message {msg.isChatMessage ? 'chat-msg' : 'system-msg'}">
			{#if msg.isChatMessage}
				{@const parts = msg.text.split(/:(.*)/s)}
				<span class="sender">{parts[0]}</span>
				<span class="text">{parts[1] || ''}</span>
			{:else}
				<span class="system-text">{msg.text}</span>
			{/if}
		</div>
	{/each}
</div>

<div class="mt-6 flex gap-3">
	<input
		type="text"
		class="flex-grow rounded-2xl border border-[var(--nav-border)] bg-[var(--card-bg)] p-4 text-[var(--text-main)] transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
		placeholder="Type a message..."
		bind:value={messageInput}
		disabled={isChatDisabled}
		on:keydown={(e) => e.key === 'Enter' && sendMessage()}
	/>
	<button
		class="rounded-2xl bg-blue-600 p-4 px-8 font-medium text-white transition-all hover:bg-blue-700 disabled:bg-gray-400/20 disabled:text-gray-500"
		on:click={sendMessage}
		disabled={isChatDisabled}>Send</button
	>
</div>

<style>
	#messages {
		padding: 1.5rem;
		height: 450px;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.custom-scrollbar::-webkit-scrollbar {
		width: 6px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: transparent;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: var(--nav-border);
		border-radius: 10px;
	}

	.message {
		max-width: 85%;
		padding: 0.75rem 1.25rem;
		border-radius: 1.25rem;
		font-size: 0.95rem;
		line-height: 1.5;
	}

	.chat-msg {
		background: var(--card-hover-bg);
		align-self: flex-start;
		border-bottom-left-radius: 0.25rem;
	}

	.system-msg {
		background: transparent;
		align-self: center;
		text-align: center;
		font-style: italic;
		color: var(--text-muted);
		font-size: 0.85rem;
		padding: 0.25rem;
	}

	.sender {
		display: block;
		font-weight: 600;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text-muted);
		margin-bottom: 0.25rem;
	}

	.text {
		color: var(--text-main);
	}
</style>
