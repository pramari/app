import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { db, FieldValue } from '$lib/server/firebase';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth();
	if (!session?.user?.id) {
		throw redirect(303, '/auth/signin');
	}

	const userId = session.user.id;

	if (!db) {
		return { characters: [], user: session.user };
	}

	try {
		const charactersSnapshot = await db
			.collection('users')
			.doc(userId)
			.collection('characters')
			.orderBy('createdAt', 'desc')
			.get();

		const characters = charactersSnapshot.docs.map((doc) => {
			const data = doc.data();
			return {
				id: doc.id,
				name: data.name as string,
				description: data.description as string,
				createdAt: data.createdAt?.toDate()?.toISOString()
			};
		});

		return {
			characters,
			user: session.user
		};
	} catch (error) {
		console.error('Error loading characters:', error);
		return {
			characters: [],
			user: session.user
		};
	}
};

export const actions: Actions = {
	save: async ({ request, locals }) => {
		const session = await locals.auth();
		if (!session?.user?.id) {
			throw redirect(303, '/auth/signin');
		}

		const formData = await request.formData();
		const name = formData.get('name') as string;
		const description = formData.get('description') as string;
		const characterId = formData.get('id') as string | undefined;

		if (!name || name.trim().length === 0) {
			return fail(400, { name, description, missing: true });
		}

		const userId = session.user.id;

		if (!db) {
			return fail(503, { error: 'Database service unavailable' });
		}

		try {
			const characterData = {
				name,
				description,
				createdAt: FieldValue.serverTimestamp()
			};

			if (characterId) {
				await db
					.collection('users')
					.doc(userId)
					.collection('characters')
					.doc(characterId)
					.set(characterData, { merge: true });
			} else {
				await db.collection('users').doc(userId).collection('characters').add(characterData);
			}

			return { success: true };
		} catch (error) {
			console.error('Error saving character:', error);
			return fail(500, { error: 'Failed to save character' });
		}
	},
	delete: async ({ request, locals }) => {
		const session = await locals.auth();
		if (!session?.user?.id) {
			throw redirect(303, '/auth/signin');
		}

		const formData = await request.formData();
		const characterId = formData.get('id') as string;

		if (!characterId) {
			return fail(400, { missingId: true });
		}

		const userId = session.user.id;

		if (!db) {
			return fail(503, { error: 'Database service unavailable' });
		}

		try {
			await db.collection('users').doc(userId).collection('characters').doc(characterId).delete();
			return { success: true };
		} catch (error) {
			console.error('Error deleting character:', error);
			return fail(500, { error: 'Failed to delete character' });
		}
	}
};
