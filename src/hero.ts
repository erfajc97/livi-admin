import { heroui } from '@heroui/react'

export default heroui({
  defaultTheme: 'light',
  themes: {
    light: {
      colors: {
        primary: {
          DEFAULT: '#4D0E12',
          foreground: '#F5EFC6',
        },
        danger: {
          DEFAULT: '#B34040',
          foreground: '#FFFFFF',
        },
        success: {
          DEFAULT: '#5F7A52',
          foreground: '#FFFFFF',
        },
        warning: {
          DEFAULT: '#B07A2A',
          foreground: '#F5EFC6',
        },
      },
    },
    dark: {
      colors: {
        primary: {
          DEFAULT: '#4D0E12',
          foreground: '#F5EFC6',
        },
        danger: {
          DEFAULT: '#B34040',
          foreground: '#FFFFFF',
        },
        success: {
          DEFAULT: '#5F7A52',
          foreground: '#FFFFFF',
        },
        warning: {
          DEFAULT: '#B07A2A',
          foreground: '#F5EFC6',
        },
      },
    },
  },
})
