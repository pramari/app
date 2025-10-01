<script>
	import { onMount } from 'svelte';
	import { createClient, IndexedDBStore, IndexedDBCryptoStore, MemoryStore } from 'matrix-js-sdk';

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

			// This is wrong.
			// await matrixClient.setDeviceVerified(userId, deviceId, true);
			// logToUI('Device marked as verified.');

			matrixClient.on('crypto.verification.request', (request) => {
				logToUI(
					`Received verification request from ${request.otherUserId}. In a real app you would now handle this request.`
				);
				console.log('Verification request:', request);
			});

			matrixClient.once('sync', function (state) {
				if (state === 'PREPARED') {
					logToUI('Client synced. You can now send/receive messages.');
				} else if (state === 'ERROR') {
					logToUI('Sync error occurred.');
				}
			});

			isLoginButtonDisabled = true;
			isChatDisabled = false;

			const room = await matrixClient.joinRoom(roomAliasToJoin);
			currentRoomId = room.roomId;

			messages = [];
			logToUI('Matrix client initialized and room joined.');

			await matrixClient.startClient({ initialSyncLimit: 10 });
		} catch (error) {
			logToUI(`Error during SSO login or chat setup: ${error.message}`);
			console.error('SSO Login/Chat Setup Error:', error);
			isLoginButtonDisabled = false;
			isChatDisabled = true;
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

<h1>Product Sauna</h1>

<div>
	<label for="userIdInput">User ID:</label>
	<input
		type="text"
		id="userIdInput"
		placeholder="Will be filled after SSO"
		readonly
		bind:value={userId}
	/>
</div>
<button on:click={initiateSsoLogin} disabled={isLoginButtonDisabled}>
	Login with SSO & Join Chat
</button>

<hr />

<div id="messages">
	{#each messages as msg}
		<div class="message">
			{#if msg.isChatMessage}
				{@const parts = msg.text.split(/:(.*)/s)}
				<span class="sender">{parts[0]}:</span>
				<span class="text">{parts[1] || ''}</span>
			{:else}
				{msg.text}
			{/if}
		</div>
	{/each}
</div>
<div class="mt-4 flex">
	<input
		type="text"
		class="flex-grow rounded-l-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
		placeholder="Type a message..."
		bind:value={messageInput}
		disabled={isChatDisabled}
		on:keydown={(e) => e.key === 'Enter' && sendMessage()}
	/>
	<button
		class="rounded-r-lg bg-blue-500 p-2 text-white hover:bg-blue-600 disabled:bg-gray-400"
		on:click={sendMessage}
		disabled={isChatDisabled}>Send</button
	>
</div>

<style>
	#messages {
		border: 1px solid #ccc;
		padding: 10px;
		height: 300px;
		overflow-y: scroll;
		margin-bottom: 10px;
	}
	.message {
		margin-bottom: 5px;
	}
	.message .sender {
		font-weight: bold;
	}
</style>
