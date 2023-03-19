import { sveltekit } from '@sveltejs/kit/vite'
import Unocss from 'unocss/vite'
import { presetUno, presetIcons, transformerDirectives, transformerVariantGroup } from 'unocss'

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [
		Unocss({
			presets: [
				presetUno({ dark: 'media' }),
				presetIcons()
			],
			transformers: [
				transformerVariantGroup(),
				transformerDirectives()
			]
		}),
		sveltekit()
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
};

export default config;
