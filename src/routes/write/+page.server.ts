import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/firebase';
import admin from 'firebase-admin';

export const load: PageServerLoad = async ({ locals }) => {
    const session = await locals.auth();
    if (!session?.user) {
        throw redirect(303, '/auth/signin');
    }

    const userId = session.user.id;
    if (!userId) {
        // Should not happen if authenticated, but safety check
        throw redirect(303, '/auth/signin');
    }

    if (!db) {
        console.warn('Firestore is not initialized.');
        return {
            writings: [],
            user: session.user,
            error: 'Database not configured'
        };
    }

    try {
        const writingsSnapshot = await db
            .collection('users')
            .doc(userId)
            .collection('writings')
            .orderBy('createdAt', 'desc')
            .get();

        const writings = writingsSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                content: data.content as string,
                // Convert timestamps to dates or strings if needed for serialization
                createdAt: data.createdAt?.toDate()?.toISOString()
            };
        });

        return {
            writings,
            user: session.user
        };
    } catch (error) {
        console.error('Error loading writings:', error);
        return {
            writings: [],
            user: session.user
        };
    }
};

export const actions: Actions = {
    save: async ({ request, locals }) => {
        const session = await locals.auth();
        if (!session?.user) {
            throw redirect(303, '/auth/signin');
        }

        const formData = await request.formData();
        const text = formData.get('text') as string;

        if (!text || text.trim().length === 0) {
            return fail(400, { missing: true });
        }

        const userId = session.user.id;
        if (!userId) {
            return fail(401, { unauthorized: true });
        }

        if (!db) {
            return fail(503, { error: 'Database service unavailable' });
        }

        try {
            await db.collection('users').doc(userId).collection('writings').add({
                content: text,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });

            return { success: true };
        } catch (error) {
            console.error('Error saving writing:', error);
            return fail(500, { error: 'Failed to save writing' });
        }
    }
};
