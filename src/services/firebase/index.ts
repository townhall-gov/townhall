// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import * as firebaseAdmin from 'firebase-admin';

if (!process.env.FIREBASE_SERVICE_ACC_CONFIG) {
	throw new Error('Internal Error: FIREBASE_SERVICE_ACC_CONFIG missing.');
}

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACC_CONFIG) as firebaseAdmin.ServiceAccount;

try {
	firebaseAdmin.initializeApp({
		credential: firebaseAdmin.credential.cert(serviceAccount)
	});
	console.log('Firebase admin Initialized');
} catch (error) {
	// Skipping the "already exists" message which is not an actual error when we're hot-reloading.
	if (!/already exists/.test(error.message)) {
		console.error('Firebase admin initialization error', error.stack);
	}
}

const firestore_db = firebaseAdmin.firestore();
export {
	firebaseAdmin
};
export default firestore_db;