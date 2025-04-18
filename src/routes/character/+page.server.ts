import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.getSession();
  if (!session) {
    throw redirect(307, "/auth/signin?callbackUrl=/character");
  }

  return {
    user: session.user,
    claims: session.claims,
  };
};
