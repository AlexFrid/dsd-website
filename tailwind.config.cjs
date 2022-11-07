/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		fontFamily: {
			'display': ['Caveat', 'sans-serif']
		},
		extend: {},
	},
	plugins: [require('@tailwindcss/typography'),],
	// corePlugins: {
	// 	preflight: false, // disables the css reset from tailwind
	// }
}
