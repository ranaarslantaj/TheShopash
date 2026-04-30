/* eslint-disable */
/**
 * ─────────────────────────────────────────────────────────────────────
 * Shop Ash · Bootstrap admin account
 * ─────────────────────────────────────────────────────────────────────
 *
 * TEMPORARY — delete after running and rotating the password.
 *
 * What this does:
 *   1. Reads Firebase config from `.env.local`
 *   2. Creates (or finds) the auth user for the email below
 *   3. Writes `users/{uid}` with role: "admin" so /myadmin will let
 *      this account into the admin console
 *
 * Run it:
 *   npm run create-admin
 * ─────────────────────────────────────────────────────────────────────
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

// EDIT THESE if you need different credentials.
const ADMIN_EMAIL = 'ranaarslantaj@gmail.com';
const ADMIN_PASSWORD = '12345678';
const ADMIN_DISPLAY_NAME = 'Rana Arslan';

// ─── Load env ────────────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = resolve(__dirname, '..', '.env.local');

const env = {};
try {
  const raw = readFileSync(envPath, 'utf-8');
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (key && value) env[key] = value;
  }
} catch {
  console.error(`✗ Could not read .env.local at ${envPath}`);
  process.exit(1);
}

const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('✗ Firebase env vars missing.');
  process.exit(1);
}

console.log(`\n✓ Connecting to project: ${firebaseConfig.projectId}\n`);

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function ensureAuthUser() {
  try {
    const cred = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
    if (ADMIN_DISPLAY_NAME) {
      await updateProfile(cred.user, { displayName: ADMIN_DISPLAY_NAME });
    }
    console.log(`  ✓ Created new auth user`);
    return cred.user.uid;
  } catch (err) {
    if (err?.code === 'auth/email-already-in-use') {
      console.log(`  ↪ Auth user already exists, signing in to fetch UID`);
      const cred = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
      return cred.user.uid;
    }
    if (err?.code === 'auth/operation-not-allowed') {
      console.error('\n  ✗ Email/Password sign-in is not enabled for this project.');
      console.error('    Open Firebase Console → Authentication → Sign-in method');
      console.error('    → enable "Email/Password" → re-run this script.\n');
      process.exit(1);
    }
    if (err?.code === 'auth/wrong-password' || err?.code === 'auth/invalid-credential') {
      console.error('\n  ✗ An account with this email already exists with a different password.');
      console.error('    Either delete the existing user from Firebase Auth, or update the');
      console.error('    ADMIN_PASSWORD constant in this script to match.\n');
      process.exit(1);
    }
    throw err;
  }
}

async function setAdminRole(uid) {
  await setDoc(
    doc(db, 'users', uid),
    {
      email: ADMIN_EMAIL,
      displayName: ADMIN_DISPLAY_NAME,
      role: 'admin',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
  console.log(`  ✓ Set role: "admin" on users/${uid}`);
}

async function main() {
  try {
    console.log('━━━ Bootstrapping admin account ━━━');
    console.log(`  Email:    ${ADMIN_EMAIL}`);
    console.log(`  Password: ${ADMIN_PASSWORD}\n`);

    const uid = await ensureAuthUser();
    await setAdminRole(uid);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✓ Admin account ready.\n');
    console.log(`  Sign in at: http://localhost:3000/myadmin`);
    console.log(`  Email:      ${ADMIN_EMAIL}`);
    console.log(`  Password:   ${ADMIN_PASSWORD}`);
    console.log(`  UID:        ${uid}\n`);
    console.log('  ⚠ Change the password from /account after first login.\n');
    process.exit(0);
  } catch (err) {
    console.error('\n✗ Failed:', err?.message ?? err);
    if (String(err?.message ?? '').toLowerCase().includes('permission')) {
      console.error('\n  Firestore rules are blocking writes. Set rules to test mode.\n');
    }
    process.exit(1);
  }
}

main();
