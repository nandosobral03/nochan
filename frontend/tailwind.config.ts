import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        darkAccent: '#143642',
        user: '#09814A',
        lightAccent: '#F05D5E',
        greentext: "#789922"
      }
    }
  },


  plugins: [],
}
export default config
