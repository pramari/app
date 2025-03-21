import { SvelteKitAuth } from "@auth/sveltekit";
import Google from "@auth/core/providers/google";
// import { OIDC } from "@auth/core/providers/oidc";
// import { OAuthConfig } from "@auth/core/providers";
// import { OAuth } from "@auth/core/providers/oauth";
import type { OAuthConfig, OAuthUserConfig } from "@auth/core/providers";

import type { Provider } from "@auth/core/providers";
import type { Session, User } from "@auth/core/types";
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  PRAMARI_CLIENT_ID,
  PRAMARI_CLIENT_SECRET,
  OIDC_ISSUER,
  AUTH_SECRET,
} from "$env/static/private";

// Optional: Define custom session type if you extend the default session
interface CustomSession extends Session {
  // Add any additional properties you need
  accessToken?: string;
}

// Define the interface for OIDC provider options
interface OIDCProviderConfig extends OAuthUserConfig<any> {
  issuer: string;
  wellKnown?: string;
}

// Define OIDC provider function
function OIDCProvider(options: OIDCProviderConfig): OAuthConfig<any> {
  return {
    id: "oidc",
    name: "pramari",
    type: "oauth",
    wellKnown: `${options.issuer}/o/.well-known/openid-configuration`,
    // options.wellKnown ||
    authorization: { params: { scope: "openid email userinfo" } },
    idToken: true,
    checks: ["pkce", "state"],
    userinfo: async (token) => {
      const response = await fetch(`${options.issuer}/o/userinfo`, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      });
      return response.json();
    },
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name || profile.preferred_username,
        email: profile.email,
        image: profile.picture,
      };
    },
    style: {
      // logo: "/company-logo.png",
      // logoDark: "/company-logo-dark.png",
      bg: "#0F172A",
      text: "#FFFFFF",
    },
    options,
  };
}

export const { handle, signIn, signOut } = SvelteKitAuth({
  providers: [
    Google({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }) as Provider,
    // Generic OIDC provider
    OIDCProvider({
      clientId: PRAMARI_CLIENT_ID,
      clientSecret: PRAMARI_CLIENT_SECRET,
      issuer: OIDC_ISSUER,
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
