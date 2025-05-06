import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { initializeApp, getApps, cert, type App } from "firebase-admin/app";

import { firestoreDB } from "$lib/server/firebase";

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.getSession();
  if (!session) {
    throw redirect(307, "/auth/signin?callbackUrl=/character");
  }

  // Check if Firestore was initialized successfully
  if (!firestoreDb) {
    console.error("Load function cannot proceed: Firestore DB not available.");
    // Throw a server error because the page cannot load essential data
    throw error(
      500,
      "Server configuration error: Could not connect to database.",
    );
  }

  return {
    user: session.user,
    claims: session.claims,
  };
};
