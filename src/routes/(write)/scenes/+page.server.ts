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
		return { scenes: [], characters: [], user: session.user };
	}

	try {
		const scenesSnapshot = await db
			.collection('users')
			.doc(userId)
			.collection('scenes')
			.orderBy('createdAt', 'desc')
			.get();

		const scenes = scenesSnapshot.docs.map((doc) => {
			const data = doc.data();
			return {
				id: doc.id,
				title: data.title as string,
				content: data.content as string,
				createdAt: data.createdAt?.toDate()?.toISOString()
			};
		});

		const charactersSnapshot = await db
			.collection('users')
			.doc(userId)
			.collection('characters')
			.orderBy('name', 'asc')
			.get();

		const characters = charactersSnapshot.docs.map((doc) => {
			const data = doc.data();
			return {
				id: doc.id,
				name: data.name as string
			};
		});

		return {
			scenes,
			characters,
			user: session.user
		};
	} catch (error) {
		console.error('Error loading scenes or characters:', error);
		return {
			scenes: [],
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
		const title = formData.get('title') as string;
		const content = formData.get('content') as string;
		const sceneId = formData.get('id') as string | undefined;

		if (!title || title.trim().length === 0) {
			return fail(400, { title, content, missing: true });
		}

		const userId = session.user.id;

		if (!db) {
			return fail(503, { error: 'Database service unavailable' });
		}

		try {
			const sceneData = {
				title,
				content,
				createdAt: FieldValue.serverTimestamp()
			};

			if (sceneId) {
				await db
					.collection('users')
					.doc(userId)
					.collection('scenes')
					.doc(sceneId)
					.set(sceneData, { merge: true });
			} else {
				await db.collection('users').doc(userId).collection('scenes').add(sceneData);
			}

			return { success: true };
		} catch (error) {
			console.error('Error saving scene:', error);
			return fail(500, { error: 'Failed to save scene' });
		}
	},
	delete: async ({ request, locals }) => {
		const session = await locals.auth();
		if (!session?.user?.id) {
			throw redirect(303, '/auth/signin');
		}

		const formData = await request.formData();
		const sceneId = formData.get('id') as string;

		if (!sceneId) {
			return fail(400, { missingId: true });
		}

		const userId = session.user.id;

		if (!db) {
			return fail(503, { error: 'Database service unavailable' });
		}

		try {
			await db.collection('users').doc(userId).collection('scenes').doc(sceneId).delete();
			return { success: true };
		} catch (error) {
			console.error('Error deleting scene:', error);
			return fail(500, { error: 'Failed to delete scene' });
		}
	}
};
