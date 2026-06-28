/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                nature: {
                    50: '#f2fcf5',
                    100: '#e1f8e8',
                    200: '#c3efd2',
                    300: '#94e0b3',
                    400: '#5cc98d',
                    500: '#34ae6f',
                    600: '#258c55',
                    700: '#206f45',
                    800: '#1e5839',
                    900: '#194931',
                    950: '#0d281c',
                }
            }
        },
    },
    plugins: [],
}
