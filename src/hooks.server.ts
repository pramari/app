import { handle as authHandle } from "$lib/server/auth";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = authHandle;

// If you have existing hooks, use sequence:
// import { sequence } from '@sveltejs/kit/hooks';
// export const handle = sequence(authHandle, yourExistingHandle);
