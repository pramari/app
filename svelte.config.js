import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// Use the Node adapter so the app can be run inside a container (Cloud Run / other Node hosts)
		adapter: adapter({
			// output directory for the built Node server
			out: 'build',
			// do not precompress by default; set to true if you want gzip/br compression at build time
			precompress: false
		})
	}
};

export default config;
