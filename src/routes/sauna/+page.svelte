<script>
	import { onMount } from 'svelte';
	import { createClient, IndexedDBStore, IndexedDBCryptoStore, MemoryStore } from 'matrix-js-sdk'; // Import the required classes

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
		console.log(message); // Log to console for debugging
	}

	function getBaseRedirectUrl() {
		return window.location.origin + window.location.pathname;
	}

	async function initiateSsoLogin() {
		logToUI('Redirecting for SSO login...');
		localStorage.setItem('sso_roomAlias', roomAlias);

		const redirectUrl = getBaseRedirectUrl();
		logToUI(`Redirect URL: ${redirectUrl}`); // Log redirect URL for debugging
		const ssoRedirectEndpoint =
			homeserverUrl.replace(/\/$/, '') +
			'/_matrix/client/v3/login/sso/redirect?redirectUrl=' +
			encodeURIComponent(redirectUrl);

		logToUI(`SSO Redirect Endpoint: ${ssoRedirectEndpoint}`); // Log SSO endpoint

		window.location.href = ssoRedirectEndpoint;
	}

	async function handleSsoCallback() {
		const urlParams = new URLSearchParams(window.location.search);
		const loginToken = urlParams.get('loginToken');
		const storedRoomAlias = localStorage.getItem('sso_roomAlias');

		logToUI(`Login Token Before Temp Client Login: ${loginToken}`);
		logToUI(`Stored Room Alias: ${storedRoomAlias}`); // Log stored room alias

		if (loginToken && storedRoomAlias) {
			logToUI('SSO login token received. Completing login...');

			const cleanUrl = getBaseRedirectUrl();
			window.history.replaceState({}, document.title, cleanUrl);
			localStorage.removeItem('sso_roomAlias');

			// Pass loginToken directly to completeSsoLoginAndStartChat
			await completeSsoLoginAndStartChat(homeserverUrl, loginToken, storedRoomAlias);
		} else {
			logToUI('Ready to login via SSO.');
			isLoginButtonDisabled = false;
		}
	}

	async function completeSsoLoginAndStartChat(
		homeserverUrl,
		loginToken,
		roomAliasToJoin,
		userId,
		deviceId
	) {
		async function completeSsoLoginAndStartChat(homeserverUrl, loginToken, roomAliasToJoin) {
			try {
				logToUI('Creating Matrix client...');
				if (typeof window !== 'undefined' && window.indexedDB) {
					try {
						matrixClient = createClient({
							baseUrl: homeserverUrl,
							store: new IndexedDBStore({ indexedDB: window.indexedDB, dbName: 'matrix-js-sdk' }),
							cryptoStore: new IndexedDBCryptoStore(window.indexedDB, 'matrix-js-sdk-crypto')
						});
					} catch (error) {
						if (error.message.includes("account in the store doesn't match")) {
							logToUI('Account mismatch detected. Clearing IndexedDB...');
							await clearIndexedDB();
							matrixClient = createClient({
								baseUrl: homeserverUrl,
								store: new IndexedDBStore({ indexedDB: window.indexedDB, dbName: 'matrix-js-sdk' }),
								cryptoStore: new IndexedDBCryptoStore(window.indexedDB, 'matrix-js-sdk-crypto')
							});
						} else {
							throw error;
						}
					}
				} else {
					logToUI('IndexedDB is not available in this environment. Falling back to MemoryStore.');
					matrixClient = createClient({
						baseUrl: homeserverUrl,
						store: new MemoryStore(),
						cryptoStore: new IndexedDBCryptoStore(window.indexedDB, 'matrix-js-sdk-crypto')
					});
				}

				await matrixClient.initRustCrypto();

				logToUI('Logging in with SSO token...');
				const loginResponse = await matrixClient.login('m.login.token', { token: loginToken });

				// Extract userId and deviceId from the login response
				const userId = loginResponse.user_id;
				const deviceId = loginResponse.device_id;

				logToUI(`Logged in as ${userId} with deviceId ${deviceId}`);

				matrixClient.once('sync', function (state, prevState, res) {
					if (state === 'PREPARED') {
						logToUI('Client synced. You can now send/receive messages.');
					} else if (state === 'ERROR') {
						logToUI(`Sync error: ${res ? res.error : 'Unknown error'}`);
					}
				});

				isLoginButtonDisabled = true;
				isChatDisabled = false;

				const room = await matrixClient.joinRoom(roomAliasToJoin);
				currentRoomId = room.roomId;

				messages = []; // Clear initial logs
				logToUI('Initializing Matrix client...');

				await matrixClient.startClient({ initialSyncLimit: 10 });
			} catch (error) {
				logToUI(`Error during SSO login or chat setup: ${error.message || error.toString()}`);
				console.error('SSO Login/Chat Setup Error:', error);
				isLoginButtonDisabled = false;
				isChatDisabled = true;
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
			matrixClient.sendEvent(currentRoomId, 'm.room.message', content, '', (err, res) => {
				if (err) {
					logToUI(`Error sending message: ${err}`);
					console.error('Send event error:', err);
				}
			});
			messageInput = '';
		} catch (error) {
			logToUI(`Error sending message: ${error.toString()}`);
			console.error('Error in sendMessage:', error);
		}
	}
	async function clearIndexedDB() {
		if (typeof window !== 'undefined' && window.indexedDB) {
			const dbs = await window.indexedDB.databases();
			for (const db of dbs) {
				window.indexedDB.deleteDatabase(db.name);
			}
			logToUI('IndexedDB cleared due to account mismatch.');
		}
	}
	async function clearIndexedDB() {
		if (typeof window !== 'undefined' && window.indexedDB) {
			const dbs = await window.indexedDB.databases();
			for (const db of dbs) {
				window.indexedDB.deleteDatabase(db.name);
			}
			logToUI('IndexedDB cleared due to account mismatch.');
		}
	}
</script>

<h1>Matrix Sauna Chat</h1>
<p>A minimal client exclusively for the #sauna:pramari.de room.</p>

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
<button on:click={initiateSsoLogin} disabled={isLoginButtonDisabled}
	>Login with SSO & Join Chat</button
>

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
<input
	type="text"
	placeholder="Type a message..."
	bind:value={messageInput}
	disabled={isChatDisabled}
	on:keydown={(e) => e.key === 'Enter' && sendMessage()}
/>
<button on:click={sendMessage} disabled={isChatDisabled}>Send</button>

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
