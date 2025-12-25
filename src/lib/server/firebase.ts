import { Firestore, FieldValue } from '@google-cloud/firestore';
import { env } from '$env/dynamic/private';

const FIREBASE_SERVICE_ACCOUNT = env.FIREBASE_SERVICE_ACCOUNT;

let db: Firestore | null = null;

try {
	if (!FIREBASE_SERVICE_ACCOUNT) {
		console.error('❌ FIREBASE_SERVICE_ACCOUNT environment variable is missing.');
	} else {
		const serviceAccount = JSON.parse(FIREBASE_SERVICE_ACCOUNT);
		db = new Firestore({
			databaseId: 'pramari',
			projectId: serviceAccount.project_id,
			credentials: {
				client_email: serviceAccount.client_email,
				private_key: serviceAccount.private_key
			}
		});
		console.log('✅ Firestore client initialized for database "pramari".');
	}
} catch (e) {
	console.error('Error initializing Firestore:', e);
}

export { db, FieldValue };
