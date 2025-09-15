<script>
	import { onMount } from 'svelte';
	import { createClient } from 'matrix-js-sdk';

	const homeserver = 'https://matrix.pramari.de';
	const roomId = '#sauna:pramari.de';
	let messages = [];
	let roomName = '';
	let client;
	let messageContent = '';

	onMount(async () => {
		client = createClient({
			baseUrl: homeserver
		});

		try {
			// We need to register as a guest user to join a room
			await client.registerGuest();
			const room = await client.joinRoom(roomId);
			await client.startClient({ initialSyncLimit: 10 });

			roomName = room.name;
			const timeline = room.getLiveTimeline();
			messages = timeline.getEvents();

			client.on('Room.timeline', (event, room, toStartOfTimeline) => {
				if (room.roomId === room.roomId) {
					messages = [...messages, event];
				}
			});
		} catch (error) {
			console.error('Error joining room or fetching messages:', error);
			if (error.errcode === 'M_GUEST_ACCESS_FORBIDDEN') {
				messages = [{ content: { body: 'Guest access is not allowed in this room.' } }];
			} else {
				messages = [{ content: { body: 'Could not load messages.' } }];
			}
		}
	});

	const sendMessage = async () => {
		if (!messageContent.trim()) return;

		try {
			await client.sendEvent(roomId, 'm.room.message', {
				body: messageContent,
				msgtype: 'm.text'
			});
			messageContent = '';
		} catch (error) {
			console.error('Error sending message:', error);
		}
	};
</script>

<h1>{roomName || 'Chat Room'}</h1>

<div class="chat-container">
	<div class="messages">
		{#each messages as message}
			{#if message.getType() === 'm.room.message'}
				<div class="message">
					<span class="sender">{message.getSender()}</span>
					<p>{message.getContent().body}</p>
				</div>
			{/if}
		{/each}
	</div>
	<div class="input-area">
		<input
			type="text"
			placeholder="Type a message..."
			bind:value={messageContent}
			on:keydown={(e) => e.key === 'Enter' && sendMessage()}
		/>
		<button on:click={sendMessage}>Send</button>
	</div>
</div>

<style>
	.chat-container {
		display: flex;
		flex-direction: column;
		height: calc(100vh - 150px);
		max-width: 800px;
		margin: 0 auto;
		border: 1px solid #ccc;
		border-radius: 8px;
		overflow: hidden;
	}
	.messages {
		flex-grow: 1;
		padding: 1rem;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.message {
		display: flex;
		flex-direction: column;
	}
	.sender {
		font-weight: bold;
		margin-bottom: 0.25rem;
	}
	.input-area {
		display: flex;
		padding: 1rem;
		border-top: 1px solid #ccc;
	}
	input {
		flex-grow: 1;
		border: 1px solid #ccc;
		padding: 0.5rem;
		border-radius: 4px;
	}
	button {
		margin-left: 1rem;
		padding: 0.5rem 1rem;
		border: none;
		background-color: #007bff;
		color: white;
		border-radius: 4px;
		cursor: pointer;
	}
</style>
