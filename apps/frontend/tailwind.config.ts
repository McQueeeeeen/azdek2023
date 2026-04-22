import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Material Design 3 - Light mode
        'surface-container-high': '#e6e8ea',
        'surface': '#f7f9fb',
        'primary-fixed-dim': '#adc6ff',
        'on-tertiary': '#ffffff',
        'on-surface-variant': '#414755',
        'primary': '#0058bc',
        'error-container': '#ffdad6',
        'secondary-fixed': '#94f990',
        'surface-variant': '#e0e3e5',
        'on-tertiary-fixed-variant': '#3b4951',
        'on-secondary-fixed': '#002204',
        'on-surface': '#191c1e',
        'primary-container': '#0070eb',
        'on-secondary-fixed-variant': '#005313',
        'inverse-primary': '#adc6ff',
        'secondary-fixed-dim': '#78dc77',
        'inverse-surface': '#2d3133',
        'on-error-container': '#93000a',
        'on-secondary-container': '#00731e',
        'surface-container-lowest': '#ffffff',
        'secondary-container': '#91f78e',
        'on-tertiary-fixed': '#0f1d25',
        'background': '#f7f9fb',
        'outline': '#717786',
        'primary-fixed': '#d8e2ff',
        'on-primary': '#ffffff',
        'surface-tint': '#005bc1',
        'on-tertiary-container': '#fbfcff',
        'on-primary-fixed-variant': '#004493',
        'surface-container-low': '#f2f4f6',
        'secondary': '#006e1c',
        'outline-variant': '#c1c6d7',
        'surface-dim': '#d8dadc',
        'inverse-on-surface': '#eff1f3',
        'surface-bright': '#f7f9fb',
        'on-primary-fixed': '#001a41',
        'tertiary-fixed-dim': '#bac9d3',
        'surface-container-highest': '#e0e3e5',
        'on-primary-container': '#fefcff',
        'tertiary-container': '#687780',
        'error': '#ba1a1a',
        'on-background': '#191c1e',
        'on-error': '#ffffff',
        'tertiary': '#505e67',
        'on-secondary': '#ffffff',
        'tertiary-fixed': '#d6e5ef',
        'surface-container': '#eceef0',
      },
      borderRadius: {
        'DEFAULT': '0.25rem',
        'lg': '1rem',
        'xl': '1.5rem',
        'full': '9999px',
      },
      fontFamily: {
        'headline': ['Manrope', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'label': ['Inter', 'sans-serif'],
      },
      letterSpacing: {
        'authoritative': '-0.02em',
      },
    },
  },
  plugins: [
    // require('@tailwindcss/forms'),  // Commented out - can interfere with custom styles
  ],
};

export default config;
