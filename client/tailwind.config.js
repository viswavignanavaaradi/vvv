/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'primary-royal': '#1e3a8a',
                'accent-emerald': '#059669',
                'text-main': '#1f2937',
                'text-body': '#4b5563',
            },
            fontFamily: {
                'merriweather': ['Merriweather', 'serif'],
                'inter': ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
