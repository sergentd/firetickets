/**
 * Design Tokens Export
 *
 * This file provides JavaScript access to design tokens for use in Vue components.
 * All tokens are also available as CSS custom properties.
 */

// Export design token categories for programmatic access
export const tokens = {
  // Spacing tokens
  spacing: {
    xs: "var(--space-xs)",
    sm: "var(--space-sm)",
    md: "var(--space-md)",
    lg: "var(--space-lg)",
    xl: "var(--space-xl)",
    "2xl": "var(--space-2xl)",
    "3xl": "var(--space-3xl)",
  },

  // Color tokens
  colors: {
    electric: {
      blue: "var(--electric-blue)",
      dark: "var(--electric-blue-dark)",
      darker: "var(--electric-blue-darker)",
      light: "var(--electric-blue-light)",
      lighter: "var(--electric-blue-lighter)",
    },
    accent: {
      red: "var(--accent-red)",
      green: "var(--accent-green)",
      yellow: "var(--accent-yellow)",
      purple: "var(--accent-purple)",
    },
    text: {
      primary: "var(--text-primary)",
      secondary: "var(--text-secondary)",
      tertiary: "var(--text-tertiary)",
      accent: "var(--text-accent)",
    },
    background: {
      primary: "var(--bg-primary)",
      secondary: "var(--bg-secondary)",
      tertiary: "var(--bg-tertiary)",
      card: "var(--bg-card)",
    },
    border: {
      primary: "var(--border-primary)",
      secondary: "var(--border-secondary)",
      accent: "var(--border-accent)",
      hover: "var(--border-hover)",
      focus: "var(--border-focus)",
    },
  },

  // Typography tokens
  typography: {
    fontSize: {
      xs: "var(--text-xs)",
      sm: "var(--text-sm)",
      base: "var(--text-base)",
      lg: "var(--text-lg)",
      xl: "var(--text-xl)",
      "2xl": "var(--text-2xl)",
      "3xl": "var(--text-3xl)",
      "4xl": "var(--text-4xl)",
      "5xl": "var(--text-5xl)",
    },
    fontWeight: {
      light: "var(--font-light)",
      normal: "var(--font-normal)",
      medium: "var(--font-medium)",
      semibold: "var(--font-semibold)",
      bold: "var(--font-bold)",
      extrabold: "var(--font-extrabold)",
    },
    lineHeight: {
      tight: "var(--leading-tight)",
      snug: "var(--leading-snug)",
      normal: "var(--leading-normal)",
      relaxed: "var(--leading-relaxed)",
      loose: "var(--leading-loose)",
    },
  },

  // Border radius tokens
  borderRadius: {
    none: "var(--radius-none)",
    sm: "var(--radius-sm)",
    md: "var(--radius-md)",
    lg: "var(--radius-lg)",
    xl: "var(--radius-xl)",
    "2xl": "var(--radius-2xl)",
    "3xl": "var(--radius-3xl)",
    full: "var(--radius-full)",
    // Semantic
    button: "var(--radius-button)",
    card: "var(--radius-card)",
    input: "var(--radius-input)",
    modal: "var(--radius-modal)",
  },

  // Animation tokens
  animation: {
    duration: {
      instant: "var(--duration-instant)",
      fast: "var(--duration-fast)",
      normal: "var(--duration-normal)",
      slow: "var(--duration-slow)",
      slower: "var(--duration-slower)",
      slowest: "var(--duration-slowest)",
    },
    easing: {
      linear: "var(--easing-linear)",
      ease: "var(--easing-ease)",
      easeIn: "var(--easing-ease-in)",
      easeOut: "var(--easing-ease-out)",
      easeInOut: "var(--easing-ease-in-out)",
      bounce: "var(--easing-bounce)",
      smooth: "var(--easing-smooth)",
      snappy: "var(--easing-snappy)",
    },
    transition: {
      default: "var(--transition-default)",
      fast: "var(--transition-fast)",
      slow: "var(--transition-slow)",
      bounce: "var(--transition-bounce)",
    },
  },

  // Shadow tokens
  shadows: {
    xs: "var(--shadow-xs)",
    sm: "var(--shadow-sm)",
    md: "var(--shadow-md)",
    lg: "var(--shadow-lg)",
    xl: "var(--shadow-xl)",
    "2xl": "var(--shadow-2xl)",
    // Semantic
    primary: "var(--shadow-primary)",
    secondary: "var(--shadow-secondary)",
    accent: "var(--shadow-accent)",
    glow: "var(--shadow-glow)",
    hover: "var(--shadow-hover)",
    focus: "var(--shadow-focus)",
    button: "var(--shadow-button)",
    card: "var(--shadow-card)",
    modal: "var(--shadow-modal)",
  },

  // Glass effect tokens
  glass: {
    background: {
      default: "var(--glass-bg)",
      light: "var(--glass-bg-light)",
      lighter: "var(--glass-bg-lighter)",
      dark: "var(--glass-bg-dark)",
      card: "var(--glass-bg-card)",
      section: "var(--glass-bg-section)",
      input: "var(--glass-bg-input)",
      modal: "var(--glass-bg-modal)",
    },
    border: {
      default: "var(--glass-border)",
      light: "var(--glass-border-light)",
      lighter: "var(--glass-border-lighter)",
      accent: "var(--glass-border-accent)",
    },
    blur: {
      none: "var(--blur-none)",
      sm: "var(--blur-sm)",
      md: "var(--blur-md)",
      lg: "var(--blur-lg)",
      xl: "var(--blur-xl)",
      "2xl": "var(--blur-2xl)",
      "3xl": "var(--blur-3xl)",
    },
  },

  // Z-index tokens
  zIndex: {
    auto: "var(--z-auto)",
    base: "var(--z-base)",
    dropdown: "var(--z-dropdown)",
    sticky: "var(--z-sticky)",
    fixed: "var(--z-fixed)",
    modal: "var(--z-modal)",
    toast: "var(--z-toast)",
  },
};

// Export individual token categories for convenience
export const {
  spacing,
  colors,
  typography,
  borderRadius,
  animation,
  shadows,
  glass,
  zIndex,
} = tokens;

// Export default
export default tokens;
