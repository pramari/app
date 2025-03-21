// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      getSession(): Promise<import("@auth/core").Session | null>;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

// Additional environment variables type definitions
declare namespace NodeJS {
  interface ProcessEnv {
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    AUTH_SECRET: string;
  }
}

export {};
