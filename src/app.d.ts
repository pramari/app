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
    // interface Platform {
    //  env?: {
    //    GOOGLE_CLIENT_ID: string;
    //    GOOGLE_CLIENT_SECRET: string;
    //    AUTH_SECRET: string;
    // Add any other environment variables here
    //  };
    // }
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
