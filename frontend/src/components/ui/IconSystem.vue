<template>
  <svg
    :class="['icon-svg', size, colorClass]"
    :width="iconSize"
    :height="iconSize"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- Palette Generator - Simple circle with inner colored circles -->
    <g v-if="name === 'palette-generator'">
      <!-- Main circle -->
      <circle
        cx="12"
        cy="12"
        r="8"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
      />
      <!-- Inner colored circles -->
      <circle cx="9" cy="9" r="1.5" :fill="primaryColor" />
      <circle cx="15" cy="9" r="1.5" :fill="secondaryColor" />
      <circle cx="9" cy="15" r="1.5" :fill="accentColor" />
      <circle cx="15" cy="15" r="1.5" :fill="tertiaryColor" />
      <circle cx="12" cy="12" r="1.5" :fill="accentRed" />
    </g>

    <!-- CSS Grid Generator - Clear grid layout -->
    <g v-else-if="name === 'css-grid-generator'">
      <!-- 2x2 Grid with gap -->
      <!-- Top-left: Primary blue -->
      <rect x="4" y="4" width="7" height="7" :fill="primaryColor" rx="0.5" />
      <!-- Top-right: Red accent -->
      <rect x="13" y="4" width="7" height="7" :fill="accentRed" rx="0.5" />
      <!-- Bottom-left: Tertiary semi-transparent blue -->
      <rect x="4" y="13" width="7" height="7" :fill="tertiaryColor" rx="0.5" />
      <!-- Bottom-right: Accent dark blue -->
      <rect x="13" y="13" width="7" height="7" :fill="accentColor" rx="0.5" />
      <!-- Grid border -->
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        stroke="currentColor"
        stroke-width="1"
        fill="none"
        rx="1"
      />
    </g>

    <!-- Color Contrast Checker - Simple circle half black half blue with dot -->
    <g v-else-if="name === 'color-contrast-checker'">
      <!-- Main circle -->
      <circle
        cx="12"
        cy="12"
        r="8"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
      />
      <!-- Half black -->
      <path d="M12 4 A8 8 0 0 1 12 20 Z" fill="#000000" />
      <!-- Half blue -->
      <path d="M12 4 A8 8 0 0 0 12 20 Z" :fill="primaryColor" />
      <!-- Dividing line -->
      <path d="M12 4v16" stroke="currentColor" stroke-width="1" />
      <!-- Opposed color dot -->
      <circle cx="16" cy="12" r="1.5" :fill="accentRed" />
    </g>

    <!-- Shadow Generator - Blue circle with offset black circle -->
    <g v-else-if="name === 'shadow-generator'">
      <!-- Shadow circle (offset black) -->
      <circle cx="14" cy="14" r="9" :fill="accentRed" opacity="0.5" />
      <!-- Main blue circle -->
      <circle
        cx="12"
        cy="12"
        r="6"
        :fill="primaryColor"
        stroke="currentColor"
        stroke-width="2"
      />
    </g>

    <!-- Flexbox Playground - Simple container with flexible rectangles -->
    <g v-else-if="name === 'flexbox-playground'">
      <!-- Container -->
      <rect
        x="3"
        y="4"
        width="18"
        height="16"
        stroke="currentColor"
        stroke-width="1"
        fill="none"
        rx="1"
      />
      <!-- Simple flexible items -->
      <rect x="5" y="8" width="2" height="8" :fill="accentRed" />
      <rect x="8" y="8" width="3" height="8" :fill="secondaryColor" />
      <rect x="12" y="8" width="4" height="8" :fill="accentColor" />
      <rect x="17" y="8" width="2" height="8" :fill="tertiaryColor" />
    </g>

    <!-- Gradient Generator - Simple rectangle with gradient -->
    <g v-else-if="name === 'gradient-generator'">
      <defs>
        <linearGradient id="simple-gradient" x1="0%" y1="0%" x2="100%" y2="60%">
          <stop offset="0%" :stop-color="accentRed" />

          <stop offset="100%" :stop-color="accentColor" />
        </linearGradient>
      </defs>
      <!-- Simple gradient rectangle -->
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        fill="url(#simple-gradient)"
        stroke="currentColor"
        stroke-width="1"
        rx="2"
      />
    </g>

    <!-- Glossary/Book - Simple book -->
    <g v-else-if="name === 'glossaire-webdev'">
      <rect
        x="6"
        y="4"
        width="12"
        height="16"
        :fill="primaryColor"
        stroke="currentColor"
        stroke-width="2"
        rx="1"
      />
      <path d="M8 8h8M8 11h6M8 17h5" :stroke="accentColor" stroke-width="1" />
      <path d="M8 14h7" stroke="#FF6B6B" stroke-width="1" />
      <path d="M6 4v16" stroke="currentColor" stroke-width="2" />
    </g>

    <!-- Theming Multi-client - Three rectangles with different colors -->
    <g v-else-if="name === 'theming-multiclient'">
      <rect
        x="3"
        y="6"
        width="5"
        height="12"
        :fill="primaryColor"
        stroke="currentColor"
        stroke-width="1.5"
        rx="1"
      />
      <rect
        x="9.5"
        y="6"
        width="5"
        height="12"
        :fill="accentRed"
        stroke="currentColor"
        stroke-width="1.5"
        rx="1"
      />
      <rect
        x="16"
        y="6"
        width="5"
        height="12"
        :fill="accentColor"
        stroke="currentColor"
        stroke-width="1.5"
        rx="1"
      />
    </g>

    <!-- CSS Specificity - Concentric circles -->
    <g v-else-if="name === 'css-specificity'">
      <circle
        cx="12"
        cy="12"
        r="8"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
      />
      <circle cx="12" cy="12" r="5" :fill="primaryColor" opacity="0.6" />
      <circle cx="12" cy="12" r="2" :fill="accentRed" />
    </g>

    <!-- WebUI Principles - Simple document with lines -->
    <g v-else-if="name === 'webui-principles'">
      <rect
        x="5"
        y="4"
        width="14"
        height="16"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
        rx="2"
      />
      <path
        d="M8 8h8M8 12h6M8 16h4"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
      />
      <path
        d="M8 8h8"
        stroke="#FF6B6B"
        stroke-width="1.5"
        stroke-linecap="round"
      />
    </g>

    <!-- Skills Evaluator - Simple bar chart -->
    <g v-else-if="name === 'skills-evaluator'">
      <rect x="4" y="14" width="2" height="6" :fill="primaryColor" />
      <rect x="8" y="12" width="2" height="8" :fill="accentRed" />
      <rect x="12" y="8" width="2" height="12" :fill="accentColor" />
      <rect x="16" y="10" width="2" height="10" :fill="tertiaryColor" />
      <rect x="20" y="6" width="2" height="14" :fill="primaryColor" />
    </g>

    <!-- Mind Map - Central circle with connected smaller circles -->
    <g v-else-if="name === 'mindmap'">
      <circle
        cx="12"
        cy="12"
        r="3"
        :fill="primaryColor"
        stroke="currentColor"
        stroke-width="2"
      />
      <circle cx="6" cy="6" r="1.5" :fill="secondaryColor" />
      <circle cx="18" cy="6" r="1.5" :fill="accentColor" />
      <circle cx="6" cy="18" r="1.5" :fill="accentRed" />
      <circle cx="18" cy="18" r="1.5" :fill="primaryColor" />
      <path
        d="M9.5 10.5L7.5 7.5M14.5 10.5L16.5 7.5M9.5 13.5L7.5 16.5M14.5 13.5L16.5 16.5"
        stroke="currentColor"
        stroke-width="1"
      />
    </g>

    <!-- Category: Theming -->
    <g v-else-if="name === 'category-theming'">
      <circle cx="7" cy="7" r="4" :fill="primaryColor" />
      <circle cx="17" cy="7" r="4" :fill="secondaryColor" />
      <circle cx="7" cy="17" r="4" :fill="accentColor" />
      <circle cx="17" cy="17" r="4" :fill="tertiaryColor" />
      <path
        d="M11 7h2M7 11v2M13 17h2M17 13v2"
        stroke="currentColor"
        stroke-width="1.5"
      />
    </g>

    <!-- Category: Reference -->
    <g v-else-if="name === 'category-reference'">
      <rect
        x="5"
        y="2"
        width="14"
        height="20"
        :fill="primaryColor"
        stroke="currentColor"
        stroke-width="2"
        rx="2"
      />
      <path
        d="M8 6h8M8 9h8M8 12h6M8 15h7M8 18h5"
        stroke="currentColor"
        stroke-width="1"
      />
      <path d="M5 2v20" stroke="currentColor" stroke-width="2" />
    </g>

    <!-- Category: Dashboard -->
    <g v-else-if="name === 'category-dashboard'">
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
        rx="2"
      />
      <rect x="4" y="16" width="2" height="4" :fill="primaryColor" />
      <rect x="7" y="14" width="2" height="6" :fill="secondaryColor" />
      <rect x="10" y="12" width="2" height="8" :fill="accentColor" />
      <rect x="13" y="10" width="2" height="10" :fill="tertiaryColor" />
      <rect x="16" y="8" width="2" height="12" :fill="primaryColor" />
      <circle cx="19" cy="5" r="1.5" :fill="accentColor" />
    </g>

    <!-- Category: Evaluation -->
    <g v-else-if="name === 'category-evaluation'">
      <path
        d="M12 2l3 6h6l-5 4 2 6-6-4-6 4 2-6-5-4h6z"
        :fill="primaryColor"
        stroke="currentColor"
        stroke-width="1"
      />
      <circle cx="12" cy="12" r="2" :fill="accentColor" />
      <path
        d="M8 16h8M9 18h6M10 20h4"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
      />
    </g>

    <!-- Category: Visualization -->
    <g v-else-if="name === 'category-visualization'">
      <circle
        cx="12"
        cy="8"
        r="3"
        :fill="primaryColor"
        stroke="currentColor"
        stroke-width="2"
      />
      <circle cx="6" cy="16" r="2" :fill="secondaryColor" />
      <circle cx="18" cy="16" r="2" :fill="accentColor" />
      <circle cx="12" cy="20" r="2" :fill="tertiaryColor" />
      <path
        d="M12 11v3M9.5 14.5L7.5 15.5M14.5 14.5L16.5 15.5M12 17v1"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
      />
    </g>

    <!-- State Icons -->
    <!-- Construction -->
    <g v-else-if="name === 'construction'">
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        :fill="primaryColor"
        stroke="currentColor"
        stroke-width="2"
        rx="2"
      />
      <path d="M8 8l8 8M16 8l-8 8" stroke="currentColor" stroke-width="2" />
      <circle cx="12" cy="12" r="2" :fill="accentColor" />
    </g>

    <!-- Error/Not Found -->
    <g v-else-if="name === 'error'">
      <circle
        cx="12"
        cy="12"
        r="9"
        :fill="primaryColor"
        stroke="currentColor"
        stroke-width="2"
      />
      <path d="M8 8l8 8M16 8l-8 8" stroke="currentColor" stroke-width="2" />
    </g>

    <!-- Search -->
    <g v-else-if="name === 'search'">
      <circle
        cx="10"
        cy="10"
        r="6"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
      />
      <path
        d="M14.5 14.5L20 20"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
      <circle cx="10" cy="10" r="3" :fill="accentRed" opacity="0.3" />
    </g>

    <!-- All/Everything -->
    <g v-else-if="name === 'all'">
      <circle cx="6" cy="6" r="2" :fill="primaryColor" />
      <circle cx="18" cy="6" r="2" :fill="secondaryColor" />
      <circle cx="6" cy="18" r="2" :fill="accentColor" />
      <circle cx="18" cy="18" r="2" :fill="tertiaryColor" />
      <circle cx="12" cy="12" r="2" :fill="accentColor" />
      <path
        d="M8 6h2M14 6h2M6 8v2M6 14v2M18 8v2M18 14v2M8 18h2M14 18h2"
        stroke="currentColor"
        stroke-width="1"
        opacity="0.6"
      />
    </g>

    <!-- Favorites -->
    <g v-else-if="name === 'favorites'">
      <path
        d="M12 2l3 6h6l-5 4 2 6-6-4-6 4 2-6-5-4h6z"
        :fill="accentColor"
        stroke="currentColor"
        stroke-width="1"
      />
      <circle cx="12" cy="12" r="2" :fill="primaryColor" />
    </g>

    <!-- Component Library - Nested squares representing components -->
    <g v-else-if="name === 'component-library'">
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
        rx="2"
      />
      <rect x="5" y="5" width="6" height="4" :fill="primaryColor" rx="1" />
      <rect x="13" y="5" width="6" height="4" :fill="secondaryColor" rx="1" />
      <rect x="5" y="11" width="14" height="3" :fill="accentColor" rx="1" />
      <rect x="5" y="16" width="6" height="4" :fill="tertiaryColor" rx="1" />
      <rect x="13" y="16" width="6" height="4" :fill="accentRed" rx="1" />
      <circle cx="8" cy="7" r="0.5" fill="white" />
      <circle cx="16" cy="7" r="0.5" fill="white" />
      <circle cx="12" cy="12.5" r="0.5" fill="white" />
    </g>

    <!-- Play Icon -->
    <g v-else-if="name === 'play'">
      <path
        d="M8 5V19L19 12L8 5Z"
        :fill="primaryColor"
        stroke="currentColor"
        stroke-width="1"
      />
    </g>

    <!-- Eye/View Icon -->
    <g v-else-if="name === 'eye' || name === 'view'">
      <path
        d="M12 5C7 5 2.73 8.11 1 12C2.73 15.89 7 19 12 19C17 19 21.27 15.89 23 12C21.27 8.11 17 5 12 5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17Z"
        :fill="primaryColor"
        stroke="currentColor"
        stroke-width="1"
      />
      <circle cx="12" cy="12" r="3" :fill="accentRed" />
    </g>

    <!-- Eye Slash/Hidden Icon -->
    <g v-else-if="name === 'eye-slash' || name === 'eye-off'">
      <path
        d="M12 5C7 5 2.73 8.11 1 12C2.73 15.89 7 19 12 19C17 19 21.27 15.89 23 12C21.27 8.11 17 5 12 5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17Z"
        :fill="primaryColor"
        stroke="currentColor"
        stroke-width="1"
      />
      <circle cx="12" cy="12" r="3" :fill="tertiaryColor" />
      <!-- Diagonal slash -->
      <path
        d="M4 20L20 4"
        :stroke="accentRed"
        stroke-width="2"
        stroke-linecap="round"
      />
    </g>

    <!-- User/Profile Icon -->
    <g v-else-if="name === 'user' || name === 'profile'">
      <circle
        cx="12"
        cy="8"
        r="4"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
      />
      <path
        d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
        stroke-linecap="round"
      />
    </g>

    <!-- Headset Icon -->
    <g v-else-if="name === 'tag' || name === 'tickets' || name === 'headset'">
      <!-- Headband -->
      <path
        d="M7 8 v-2 C7 3.79 8.79 2 11 2h2C15.21 2 17 3.79 17 6v2"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
      />

      <!-- Left earpad -->
      <ellipse
        cx="7"
        cy="10"
        rx="2"
        ry="3"
        :fill="primaryColor"
        stroke="currentColor"
        stroke-width="1.5"
      />

      <!-- Right earpad -->
      <ellipse
        cx="17"
        cy="10"
        rx="2"
        ry="3"
        :fill="primaryColor"
        stroke="currentColor"
        stroke-width="1.5"
      />

      <!-- MODIFIED: Microphone arm now has a small stem creating a gap -->
      <path
        d="M6 13.5 V 13.5 Q6 17 10 17"
        stroke="currentColor"
        stroke-width="1.5"
        fill="none"
        stroke-linecap="round"
      />

      <!-- MODIFIED: Microphone position updated to match the arm's new end -->
      <circle cx="10" cy="17" r="1.5" :fill="accentRed" />
    </g>

    <!-- Lifebuoy Icon -->
    <g v-else-if="name === 'lifebuoy'">
      <!-- Define mask for center hole -->
      <defs>
        <mask id="lifebuoy-mask">
          <rect x="0" y="0" width="24" height="24" fill="white" />
          <circle cx="12" cy="12" r="4" fill="black" />
        </mask>
      </defs>
      <!-- Four quarter segments with alternating colors -->
      <!-- Top quarter (red) -->
      <path
        d="M12 4A8 8 0 0 1 20 12L12 12Z"
        :fill="accentRed"
        mask="url(#lifebuoy-mask)"
      />
      <!-- Right quarter (white) -->
      <path
        d="M20 12A8 8 0 0 1 12 20L12 12Z"
        fill="white"
        mask="url(#lifebuoy-mask)"
      />
      <!-- Bottom quarter (red) -->
      <path
        d="M12 20A8 8 0 0 1 4 12L12 12Z"
        :fill="accentRed"
        mask="url(#lifebuoy-mask)"
      />
      <!-- Left quarter (white) -->
      <path
        d="M4 12A8 8 0 0 1 12 4L12 12Z"
        fill="white"
        mask="url(#lifebuoy-mask)"
      />
      <!-- Outer ring stroke -->
      <circle
        cx="12"
        cy="12"
        r="8"
        fill="none"
        :stroke="accentColor"
        stroke-width="2"
      />
    </g>
    <!-- Chevron Right -->
    <g v-else-if="name === 'chevron-right'">
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>

    <!-- Arrow Right -->
    <g v-else-if="name === 'arrow-right'">
      <path
        d="M5 12h14m-6-6l6 6-6 6"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>

    <!-- Chevron Down -->
    <g v-else-if="name === 'chevron-down'">
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>

    <!-- Plus Icon -->
    <g v-else-if="name === 'plus'">
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>

    <!-- X/Close Icon -->
    <g v-else-if="name === 'x'">
      <path
        d="M18 6L6 18M6 6l12 12"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>

    <!-- Shuffle Icon -->
    <g v-else-if="name === 'shuffle'">
      <polyline
        points="16,3 21,3 21,8"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M4 20L21 3"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <polyline
        points="21,16 21,21 16,21"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M15 15l6 6M4 4l5 5"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>

    <!-- Check Icon -->
    <g v-else-if="name === 'check'">
      <polyline
        points="20,6 9,17 4,12"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>

    <!-- Clipboard Icon -->
    <g v-else-if="name === 'clipboard'">
      <path
        d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <rect
        x="8"
        y="2"
        width="8"
        height="4"
        rx="1"
        ry="1"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
      />
    </g>

    <!-- Copy Icon -->
    <g v-else-if="name === 'copy'">
      <path
        d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"
        fill="currentColor"
      />
    </g>

    <!-- Menu Icon -->
    <g v-else-if="name === 'menu'">
      <path
        d="M4 6h16M4 12h16M4 18h16"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>

    <!-- Dots Vertical (More Options) Icon -->
    <g v-else-if="name === 'dots-vertical' || name === 'more-vertical'">
      <path
        d="M12 5v.01M12 12v.01M12 19v.01"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>

    <!-- Edit/Pencil Icon -->
    <g v-else-if="name === 'edit' || name === 'pencil'">
      <path
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>

    <!-- Trash/Delete Icon -->
    <g v-else-if="name === 'trash' || name === 'delete'">
      <path
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>

    <!-- Phone Icon -->
    <g v-else-if="name === 'phone'">
      <path
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>

    <!-- Document/File Icon -->
    <g v-else-if="name === 'document' || name === 'file'">
      <path
        d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h2m0-13h10a2 2 0 012 2v11a2 2 0 01-2 2H9m0-13v13"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>

    <!-- Clock Icon -->
    <g v-else-if="name === 'clock' || name === 'time'">
      <path
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>

    <!-- Refresh/Redo Icon -->
    <g v-else-if="name === 'refresh' || name === 'redo'">
      <path
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>

    <!-- Star (outline) -->
    <g v-else-if="name === 'star'">
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>

    <!-- Book Icon -->
    <g v-else-if="name === 'book'">
      <path
        d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 004 17V5a2 2 0 012-2h10a2 2 0 012 2v14M4 19.5A2.5 2.5 0 016.5 22H20v-5"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M9 7h6M9 11h4"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
    </g>

    <!-- Palette Icon -->
    <g v-else-if="name === 'palette'">
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.9 0 1.3-.7 1.3-1.5 0-.4-.1-.7-.3-1-.2-.3-.3-.5-.3-.9 0-.6.4-1 1-1h1.5c3.6 0 6.5-2.9 6.5-6.5C22 6.48 17.52 2 12 2z"
        stroke="currentColor"
        stroke-width="1.5"
        fill="none"
      />
      <circle cx="6.5" cy="11.5" r="1.5" :fill="primaryColor" />
      <circle cx="9.5" cy="7.5" r="1.5" :fill="secondaryColor" />
      <circle cx="14.5" cy="7.5" r="1.5" :fill="accentColor" />
      <circle cx="17.5" cy="11.5" r="1.5" :fill="accentRed" />
    </g>

    <!-- Cog/Settings Icon -->
    <g v-else-if="name === 'cog' || name === 'settings-gear'">
      <path
        d="M12 15a3 3 0 100-6 3 3 0 000 6z"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
      />
      <path
        d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
      />
    </g>

    <!-- Wrench/Tool Icon -->
    <g v-else-if="name === 'wrench' || name === 'tool'">
      <path
        d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>

    <!-- Alert/Warning Icon -->
    <g v-else-if="name === 'alert' || name === 'warning'">
      <path
        d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <circle cx="12" cy="17" r="0.5" :fill="accentRed" />
    </g>

    <!-- Lightbulb/Idea Icon -->
    <g v-else-if="name === 'lightbulb' || name === 'idea'">
      <path
        d="M9 21h6M12 3a6 6 0 00-4 10.472V17a1 1 0 001 1h6a1 1 0 001-1v-3.528A6 6 0 0012 3z"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <circle cx="12" cy="9" r="2" :fill="primaryColor" />
    </g>

    <!-- Star (filled) -->
    <g v-else-if="name === 'star-filled'">
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill="currentColor"
      />
    </g>

    <!-- Arrow Left -->
    <g v-else-if="name === 'arrow-left'">
      <path
        d="M19 12H5M12 19l-7-7 7-7"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>

    <!-- External Link -->
    <g v-else-if="name === 'external-link'">
      <path
        d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>

    <!-- Upload/Migrate Icon -->
    <g v-else-if="name === 'upload' || name === 'migrate'">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
        stroke="currentColor"
        fill="none"
      />
    </g>

    <!-- Spinner/Loading Icon -->
    <g v-else-if="name === 'spinner' || name === 'loading'">
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
        fill="none"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </g>

    <!-- Check Circle Icon -->
    <g v-else-if="name === 'check-circle'">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        stroke="currentColor"
        fill="none"
      />
    </g>

    <!-- Download Icon -->
    <g v-else-if="name === 'download'">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        stroke="currentColor"
        fill="none"
      />
    </g>

    <!-- Image/Photo Icon -->
    <g v-else-if="name === 'image' || name === 'photo'">
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="2"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
      />
      <circle cx="8.5" cy="8.5" r="1.5" :fill="primaryColor" />
      <path
        d="M21 15l-5-5L5 21"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>

    <!-- Video Icon -->
    <g v-else-if="name === 'video'">
      <path
        d="M23 7l-7 5 7 5V7z"
        :fill="primaryColor"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <rect
        x="1"
        y="5"
        width="15"
        height="14"
        rx="2"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
      />
    </g>

    <!-- Music/Audio Icon -->
    <g v-else-if="name === 'music' || name === 'audio'">
      <path
        d="M9 18V5l12-2v13"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <circle cx="6" cy="18" r="3" :fill="primaryColor" stroke="currentColor" stroke-width="2" />
      <circle cx="18" cy="16" r="3" :fill="accentColor" stroke="currentColor" stroke-width="2" />
    </g>

    <!-- File Text Icon -->
    <g v-else-if="name === 'file-text'">
      <path
        d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
      />
      <path d="M14 2v6h6" stroke="currentColor" stroke-width="2" fill="none" />
      <path
        d="M16 13H8M16 17H8M10 9H8"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
    </g>

    <!-- Table/Spreadsheet Icon -->
    <g v-else-if="name === 'table' || name === 'spreadsheet'">
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="2"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
      />
      <path d="M3 9h18M3 15h18M12 3v18" stroke="currentColor" stroke-width="2" />
    </g>

    <!-- Presentation Icon -->
    <g v-else-if="name === 'presentation'">
      <rect
        x="2"
        y="3"
        width="20"
        height="14"
        rx="2"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
      />
      <path d="M8 21l4-4 4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M12 17v4" stroke="currentColor" stroke-width="2" />
      <path d="M8 7l3 3 3-3" :stroke="primaryColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
    </g>

    <!-- Archive/Zip Icon -->
    <g v-else-if="name === 'archive' || name === 'zip'">
      <path
        d="M21 8v13H3V8"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M1 3h22v5H1z"
        :fill="primaryColor"
        stroke="currentColor"
        stroke-width="2"
      />
      <path d="M10 12h4" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    </g>

    <!-- Code Icon -->
    <g v-else-if="name === 'code'">
      <path
        d="M16 18l6-6-6-6M8 6l-6 6 6 6"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>

    <!-- Paperclip/Attachment Icon -->
    <g v-else-if="name === 'paperclip' || name === 'attachment'">
      <path
        d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>

    <!-- Default fallback -->
    <g v-else>
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        :fill="primaryColor"
        stroke="currentColor"
        stroke-width="2"
        rx="3"
      />
      <circle cx="12" cy="12" r="4" :fill="accentColor" />
    </g>
  </svg>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: "md",
    validator: (value) => ["xs", "sm", "md", "lg", "xl", "2xl"].includes(value),
  },
  variant: {
    type: String,
    default: "default",
    validator: (value) =>
      ["default", "electric", "mono", "custom"].includes(value),
  },
  customColors: {
    type: Object,
    default: () => ({}),
  },
});

// Size mappings
const iconSize = computed(() => {
  const sizes = {
    xs: "16",
    sm: "20",
    md: "24",
    lg: "32",
    xl: "48",
    "2xl": "64",
  };
  return sizes[props.size] || "24";
});

// Color schemes
const colorScheme = computed(() => {
  if (
    props.variant === "custom" &&
    Object.keys(props.customColors).length > 0
  ) {
    return props.customColors;
  }

  const schemes = {
    default: {
      primary: "var(--electric-blue)",
      secondary: "var(--electric-blue-light)",
      accent: "var(--electric-blue-dark)",
      tertiary: "rgba(var(--electric-blue-rgb), 0.6)",
    },
    electric: {
      primary: "#00D4FF",
      secondary: "#33DDFF",
      accent: "#0099CC",
      tertiary: "rgba(0, 212, 255, 0.4)",
    },
    mono: {
      primary: "currentColor",
      secondary: "currentColor",
      accent: "currentColor",
      tertiary: "currentColor",
    },
  };

  return schemes[props.variant] || schemes.default;
});

// Individual color accessors
const primaryColor = computed(() => colorScheme.value.primary);
const secondaryColor = computed(() => colorScheme.value.secondary);
const accentColor = computed(() => colorScheme.value.accent);
const tertiaryColor = computed(() => colorScheme.value.tertiary);
const accentRed = computed(() => "var(--accent-red)");

// CSS classes
const colorClass = computed(() => {
  if (props.variant === "mono") return "text-current";
  return "text-electric-blue";
});
</script>

<style scoped>
.icon-svg {
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
}

.xs {
  @apply w-4 h-4;
}
.sm {
  @apply w-5 h-5;
}
.md {
  @apply w-6 h-6;
}
.lg {
  @apply w-8 h-8;
}
.xl {
  @apply w-12 h-12;
}
.\32xl {
  @apply w-16 h-16;
}
</style>
