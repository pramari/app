import { SvelteKitAuth } from '@auth/sveltekit';
import Google from '@auth/core/providers/google';
// import { OIDC } from "@auth/core/providers/oidc";
// import { OAuthConfig } from "@auth/core/providers";
// import { OAuth } from "@auth/core/providers/oauth";
import type { OAuthConfig, OAuthUserConfig } from '@auth/core/providers';

import type { Provider } from '@auth/core/providers';
import type { Session, User } from '@auth/core/types';
import { env } from '$env/dynamic/private';

const { PRAMARI_CLIENT_ID, PRAMARI_CLIENT_SECRET, OIDC_ISSUER, AUTH_SECRET } = env;

if (!PRAMARI_CLIENT_ID) console.error('❌ PRAMARI_CLIENT_ID is missing');
if (!PRAMARI_CLIENT_SECRET) console.error('❌ PRAMARI_CLIENT_SECRET is missing');
if (!OIDC_ISSUER) console.error('❌ OIDC_ISSUER is missing');
if (!AUTH_SECRET) console.error('❌ AUTH_SECRET is missing');
import Resend from '@auth/core/providers/resend';

// Optional: Define custom session type if you extend the default session
interface CustomSession extends Session {
	// Add any additional properties you need
	accessToken?: string;
	first_name?: string;
	last_name?: string;
	permissions?: string[];
	services?: string[];
}

// Define the interface for OIDC provider options
interface OIDCProviderConfig extends OAuthUserConfig<any> {
	issuer: string;
	wellKnown?: string;
}

// Define OIDC provider function
function OIDCProvider(options: OIDCProviderConfig): OAuthConfig<any> {
	console.log('--- OIDC CONFIG ---');
	console.log('Env OIDC_ISSUER:', options.issuer);
	const wellKnownUrl = `${options.issuer}/o/.well-known/openid-configuration`;
	console.log('Constructed wellKnown:', wellKnownUrl);
	console.log('-------------------');

	return {
		...options,
		id: 'pramari.de',
		name: 'pramari',
		type: 'oauth',
		wellKnown: wellKnownUrl,
		authorization: { params: { scope: 'openid email userinfo' } },
		// issuer: 'https://pramari.de',
		idToken: true,
		checks: ['pkce', 'state'],
		userinfo: async (token) => {
			const response = await fetch(`${options.issuer}/o/userinfo`, {
				headers: {
					Authorization: `Bearer ${token.accessToken}`
				}
			});
			return response.json();
		},
		profile(profile) {
			return {
				id: profile.sub,
				name: profile.name || profile.username,
				first_name: profile.first_name,
				last_name: profile.last_name,
				email: profile.email,
				image: profile.image,
				permissions: profile.permissions,
				services: profile.services
			};
		},
		style: {
			logo: 'https://pramari.de/logo.png',
			// logoDark: "/company-logo-dark.png",
			bg: '#0F172A',
			text: '#FFFFFF'
		}
	};
}

export const { handle, signIn, signOut } = SvelteKitAuth({
	secret: AUTH_SECRET,
	trustHost: true,
	providers: [
		/*
	Google({
		clientId: GOOGLE_CLIENT_ID,
		clientSecret: GOOGLE_CLIENT_SECRET,
		authorization: { params: { scope: 'openid email' } }
	}) as Provider,
 */
		// Generic OIDC provider
		OIDCProvider({
			clientId: PRAMARI_CLIENT_ID,
			clientSecret: PRAMARI_CLIENT_SECRET,
			issuer: OIDC_ISSUER
		}) as Provider
		// Add other providers here
	],
	callbacks: {
		async session({ session, token }): Promise<CustomSession> {
			// Add additional user info to the session if needed
			return {
				...session,
				accessToken: token.accessToken as string,
				first_name: token.first_name as string | undefined,
				last_name: token.last_name as string | undefined,
				permissions: token.permissions as string[] | undefined
			};
		},
		async jwt({ token, user, account }) {
			// Save the access token from the OAuth provider to the JWT
			if (account) {
				token.accessToken = account.access_token;
			}
			if (user) {
				token.first_name = user.first_name;
				token.last_name = user.last_name;
				token.permissions = user.permissions;
			}
			return token;
		}
	}
});
