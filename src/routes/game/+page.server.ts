import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.getSession();
  
  // If user is not logged in, redirect to the sign-in page
  if (!session) {
    throw redirect(303, '/auth/signin?callbackUrl=/game');
  }
  
  // Return the session for the client component
  return {
    user: session.user
  };
};