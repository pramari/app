import admin from 'firebase-admin';
import { env } from '$env/dynamic/private';

const FIREBASE_SERVICE_ACCOUNT = env.FIREBASE_SERVICE_ACCOUNT;

let dbInstance: admin.firestore.Firestore | null = null;

try {
    if (!FIREBASE_SERVICE_ACCOUNT) {
        console.error('❌ FIREBASE_SERVICE_ACCOUNT environment variable is missing.');
    } else if (!admin.apps.length) {
        try {
            const serviceAccount = JSON.parse(FIREBASE_SERVICE_ACCOUNT);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
            console.log('✅ Firebase Admin initialized successfully.');
        } catch (parseError) {
            console.error('❌ Failed to parse FIREBASE_SERVICE_ACCOUNT JSON:', parseError);
        }
    }

    if (admin.apps.length) {
        dbInstance = admin.firestore();
    }
} catch (e) {
    console.error('Error initializing Firebase:', e);
}

export const db = dbInstance;
