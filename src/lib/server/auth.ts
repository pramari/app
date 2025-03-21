import { SvelteKitAuth } from "@auth/sveltekit";
import Google from "@auth/core/providers/google";
import type { Provider } from "@auth/core/providers";
import type { Session, User } from "@auth/core/types";
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  AUTH_SECRET,
} from "$env/static/private";

// Optional: Define custom session type if you extend the default session
interface CustomSession extends Session {
  // Add any additional properties you need
  accessToken?: string;
}

export const { handle, signIn, signOut } = SvelteKitAuth({
  providers: [
    Google({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }) as Provider,
    // Add other providers here
  ],
  secret: AUTH_SECRET,
  trustHost: true,
  callbacks: {
    async session({ session, token }): Promise<CustomSession> {
      // Add additional user info to the session if needed
      return {
        ...session,
        accessToken: token.accessToken as string,
      };
    },
    async jwt({ token, account }) {
      // Save the access token from the OAuth provider to the JWT
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
});
