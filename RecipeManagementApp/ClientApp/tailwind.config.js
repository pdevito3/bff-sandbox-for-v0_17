const colors = require('tailwindcss/colors')

module.exports = {
	darkMode: 'class',
	content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
	theme: {
		extend: {
			height: {
				"screen-minus-private-header": 'calc(100vh - var(--private-header-height))',
				"private-header": 'var(--private-header-height)',
			}
		},
	},
  plugins: [
    require('@tailwindcss/forms'),
  ],
}