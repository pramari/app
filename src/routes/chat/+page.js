import { createClient } from 'matrix-js-sdk';
import { error } from '@sveltejs/kit';

const homeserver = 'https://matrix.pramari.de';
const roomId = '#sauna:pramari.de';

export async function load() {
	const client = createClient({
		baseUrl: homeserver
	});

	try {
		await client.registerGuest();
		const room = await client.joinRoom(roomId);
		await client.startClient({ initialSyncLimit: 10 });

		const roomName = room.name;
		const timeline = room.getLiveTimeline();
		const messages = timeline.getEvents();

        // We can't return the client object because it's not serializable.
        // We also can't return the full message objects as they are complex.
        // We should extract the data we need.
        const plainMessages = messages
            .filter(m => m.getType() === 'm.room.message')
            .map(m => ({
                sender: m.getSender(),
                body: m.getContent().body,
                id: m.getId(),
            }));

        // Stop the client after fetching initial data, as we can't keep it running on the server.
        // The client-side will have to create its own client to get live updates.
        client.stopClient();

		return {
			roomName,
			messages: plainMessages,
            homeserver,
            roomId
		};
	} catch (e) {
		console.error('Error joining room or fetching messages:', e);
        if (e.errcode === 'M_GUEST_ACCESS_FORBIDDEN') {
            throw error(403, 'Guest access is not allowed in this room.');
        }
		throw error(500, 'Could not load messages.');
	}
}
