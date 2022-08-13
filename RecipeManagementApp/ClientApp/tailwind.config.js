const colors = require('tailwindcss/colors')

module.exports = {
	darkMode: 'class',
	content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
	theme: {
		extend: {},
	},
  plugins: [
    require('@tailwindcss/forms'),
  ],
}