import adapter from '@sveltejs/adapter-vercel'
import { vitePreprocess } from '@sveltejs/kit/vite'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			runtime: 'edge',
			memory: 256,
			split: false
		}),
		csp: {
			mode: "auto",
			directives: {
				'base-uri': ["'self'"],
				'child-src': ["'self'"],
				'connect-src': ["'self'", 'https://*.google-analytics.com', 'https://*.analytics.google.com', 'https://*.googletagmanager.com'],
				'img-src': ["'self'", 'data:', 'https://*.google-analytics.com', 'https://*.googletagmanager.com'],
				'font-src': ["'self'", 'data:'],
				'form-action': ["'self'"],
				'frame-ancestors': ["'self'"],
				'frame-src': [
					"'self'",
					// "https://*.stripe.com",
					// "https://*.facebook.com",
					// "https://*.facebook.net",
					// 'https://hcaptcha.com',
					// 'https://*.hcaptcha.com',
				],
				'manifest-src': ["'self'"],
				'media-src': ["'self'", 'data:'],
				'object-src': ["'none'"],
				'style-src': ["'self'", "'unsafe-inline'", 'https://tagmanager.google.com'],
				'default-src': [
					'self'
				],
				'script-src': [
					"'self'",
					'https://*.googletagmanager.com'
				],
				'worker-src': ["'self'"],
			}
		}
	},
	vitePlugin: {
		experimental: {
			inspector: true
		}
	}
};

export default config;
