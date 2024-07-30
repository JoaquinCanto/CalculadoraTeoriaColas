const { nextui } = require('@nextui-org/react')
/** @type {import('tailwindcss').Config} */

export default {
	content: [
		'./index.html',
		'./src/**/*.{js,ts,jsx,tsx}',
		'./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {},
	},
	darkMode: 'class',
	plugins: [nextui({
		themes: {
			dark: {
				colors: {
					primary: {
						DEFAULT: '#078800',
						foreground: '#000000',
					},
					secondary: {
						DEFAULT: '#9234eb',
						foreground: '#000000',
					},
				},
			},
		},
	})],
}
