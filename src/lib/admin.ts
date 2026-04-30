import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export const isAdmin = async (uid: string): Promise<boolean> => {
  if (!db) return false;
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    return snap.exists() && snap.data()?.role === 'admin';
  } catch (err) {
    console.error('isAdmin check failed:', err);
    return false;
  }
};
