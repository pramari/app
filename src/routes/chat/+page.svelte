<script>
	import { onMount } from 'svelte';
	import { createClient } from 'matrix-js-sdk';

	export let data;

	let { roomName, messages: initialMessages, homeserver, roomId } = data;
	let messages = initialMessages;
	let client;
	let messageContent = '';

	onMount(async () => {
		client = createClient({
			baseUrl: homeserver
		});

		try {
			await client.registerGuest();
			await client.joinRoom(roomId);
			await client.startClient();

			client.on('Room.timeline', (event, room, toStartOfTimeline) => {
				if (room.roomId === roomId) {
					if (event.getType() === 'm.room.message') {
						const newMessage = {
							sender: event.getSender(),
							body: event.getContent().body,
							id: event.getId()
						};
						// Avoid adding duplicates from the initial load
						if (!messages.find((m) => m.id === newMessage.id)) {
							messages = [...messages, newMessage];
						}
					}
				}
			});
		} catch (error) {
			console.error('Error setting up live updates:', error);
		}

		return () => {
			if (client) {
				client.stopClient();
			}
		};
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
		{#each messages as message (message.id)}
			<div class="message">
				<span class="sender">{message.sender}</span>
				<p>{message.body}</p>
			</div>
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
