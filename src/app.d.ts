// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			getSession(): Promise<import('@auth/core').Session | null>;
		}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

// Additional environment variables type definitions
declare namespace NodeJS {
	interface ProcessEnv {
		PRAMARI_CLIENT_ID: string;
		PRAMARI_CLIENT_SECRET: string;
		AUTH_SECRET: string;
	}
}

export {};
