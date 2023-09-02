import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    "./src/utils/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        darkAccent: '#143642',
        user: '#09814A',
        lightAccent: '#F05D5E',
        greentext: "#789922",
        primaryLight: "#EDE6D4",
        primary: "#f5f5f5",

      },
      maxWidth: {
        'xxs': '8rem',
      },
      height: {
        '128': '32rem',
        '144': '36rem',
        '160': '40rem',
        '176': '44rem',
        '192': '48rem'
      },
      width: {
        '128': '32rem',
        '144': '36rem',
        '160': '40rem',
        '176': '44rem',
        '192': '48rem'
      },
    }
  },


  plugins: [],
}
export default config
