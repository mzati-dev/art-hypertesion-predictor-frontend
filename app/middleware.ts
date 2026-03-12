// lib/auth-utils.ts
import { auth } from '@/lib/firebase';
import { getAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';

export async function getCurrentUser() {
  const session = (await cookies()).get('__session')?.value;
  if (!session) return null;

  try {
    const decodedToken = await getAuth().verifySessionCookie(session);
    return decodedToken;
  } catch (error) {
    return null;
  }
}