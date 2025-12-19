import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],

	server: {
		proxy: {
			'/api': {
				target: 'https://pramari.de',
				changeOrigin: true,
				secure: false
			}
		}
	},

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
