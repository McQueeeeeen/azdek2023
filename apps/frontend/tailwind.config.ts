import type { Config } from 'tailwindcss';

/**
 * AZDEK DESIGN SYSTEM — Warm Terracotta / Editorial Laboratory
 *
 * Единая дизайн-система. Все цвета соответствуют CSS-переменным
 * из globals.css (Editorial Laboratory стиль).
 *
 * Принцип: один источник правды. Tailwind-классы маппятся
 * на CSS-переменные, а не дублируют значения.
 *
 * Удалены: Material Design 3 цвета (PureLab), которые
 * конфликтовали с основным стилем.
 */
const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Surfaces (из globals.css) ──
        'bg':            'var(--bg)',            // #FAFAF8 — warm near-white
        'bg-alt':        'var(--bg-alt)',        // #F3F1EC — section separation
        'surface':       'var(--surface)',       // #FFFFFF — cards, panels
        'ink-bg':        'var(--ink-bg)',        // #111118 — dark sections

        // ── Typography ──
        'ink':           'var(--ink)',           // #111118 — primary text
        'ink-2':         'var(--ink-2)',         // #484850 — secondary text
        'ink-3':         'var(--ink-3)',         // #9696A0 — tertiary text
        'ink-inv':       'var(--ink-inv)',       // #FAFAF8 — text on dark bg

        // ── Accent — Terracotta ──
        'clay':          'var(--clay)',          // #C4583A — main accent
        'clay-mid':      'var(--clay-mid)',      // #D96A4A — hover
        'clay-light':    'var(--clay-light)',    // #FAEDE8 — tint background
        'clay-dark':     'var(--clay-dark)',     // #9C3F26 — pressed

        // ── Borders ──
        'line':          'var(--line)',          // #E8E5DF — hairline
        'line-2':        'var(--line-2)',        // #D4D0C8 — stronger

        // ── Status colors (hardcoded, not from CSS vars) ──
        'success':       '#27AE60',
        'warning':       '#F39C12',
        'error':         '#E74C3C',
        'info':          '#3498DB',
      },
      borderRadius: {
        'xs':    'var(--r-xs)',   // 2px
        'sm':    'var(--r-sm)',   // 6px
        'md':    'var(--r-md)',   // 10px
        'lg':    'var(--r-lg)',   // 16px
        'xl':    'var(--r-xl)',   // 24px
        'full':  'var(--r-full)', // 999px
      },
      fontFamily: {
        'headline': ['Manrope', 'sans-serif'],
        'body':     ['Inter', 'sans-serif'],
        'label':    ['Inter', 'sans-serif'],
      },
      letterSpacing: {
        'editorial': '-0.03em',   // headlines tight
        'authoritative': '-0.045em', // hero headlines
        'label': '0.06em',        // label uppercase
      },
      boxShadow: {
        'xs':  'var(--sh-xs)',   // 0 1px 2px rgba(17,17,24,.04)
        'sm':  'var(--sh-sm)',   // 0 2px 8px rgba(17,17,24,.06)
        'md':  'var(--sh-md)',   // 0 8px 24px rgba(17,17,24,.08)
        'lg':  'var(--sh-lg)',   // 0 20px 56px rgba(17,17,24,.10)
      },
      maxWidth: {
        'site': 'var(--max-w)',  // 1360px
      },
      spacing: {
        'header': 'var(--header-h)', // 68px
        'gutter': 'var(--gutter)',   // clamp(16px, 4vw, 72px)
      },
    },
  },
  plugins: [],
};

export default config;
