/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./*.html', './shared.js'],
    theme: {
        extend: {
            colors: {
                forest: { DEFAULT: '#1B4332', light: '#2D6A4F', dark: '#081C15', pale: '#D8F3DC' },
                sage: '#40916C',
                cta: { DEFAULT: '#E86A10', hover: '#D45A00', light: '#FF8534' },
                surface: { DEFAULT: '#F7F7F5', alt: '#EEEEE9' }
            },
            fontFamily: {
                heading: ['"Montserrat"', 'sans-serif'],
                body: ['"Inter"', 'sans-serif']
            }
        }
    },
    plugins: []
}
