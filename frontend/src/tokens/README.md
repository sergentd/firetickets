# Design Tokens

This directory contains the design token system for the UI Tools Vue application. Design tokens are the visual design atoms of the design system — specifically, they are named entities that store visual design attributes.

## What are Design Tokens?

Design tokens are a methodology for expressing design decisions in a format that all tools can understand. They help maintain consistency and enable systematic updates across the entire application.

## Structure

### CSS Custom Properties

All design tokens are defined as CSS custom properties in `/src/style.css` and are available throughout the application.

### JavaScript Access

For programmatic access in Vue components, tokens are also exported as JavaScript objects from `/src/tokens/index.js`.

## Token Categories

### 1. Spacing System

- **Base Scale**: From `--space-1` (4px) to `--space-24` (96px)
- **Semantic Scale**: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`
- **Component-Specific**: `--card-padding`, `--button-padding-x`, etc.

```css
/* Usage examples */
padding: var(--space-md);
margin: var(--card-padding);
gap: var(--section-gap);
```

### 2. Color System

#### Electric Blue Palette

```css
--electric-blue: #00d4ff;
--electric-blue-dark: #0099cc;
--electric-blue-light: #33ddff;
```

#### Semantic Colors

```css
--text-primary: #ffffff;
--bg-primary: #000000;
--border-primary: rgba(255, 255, 255, 0.1);
```

#### Status Colors

```css
--color-success: #10b981;
--color-warning: #f59e0b;
--color-error: #ef4444;
```

### 3. Typography

- **Font Sizes**: From `--text-xs` (12px) to `--text-5xl` (48px)
- **Font Weights**: From `--font-light` (300) to `--font-extrabold` (800)
- **Line Heights**: From `--leading-tight` (1.25) to `--leading-loose` (2)

### 4. Border Radius

- **Scale**: From `--radius-sm` (4px) to `--radius-3xl` (32px)
- **Semantic**: `--radius-button`, `--radius-card`, `--radius-input`

### 5. Animation System

- **Duration**: From `--duration-fast` (150ms) to `--duration-slowest` (1000ms)
- **Easing**: Various curves including `--easing-bounce`, `--easing-smooth`
- **Transitions**: Pre-configured combinations like `--transition-default`

### 6. Glass Effects

- **Backgrounds**: Different opacity levels for glass morphism
- **Borders**: Coordinated glass borders
- **Blur**: Backdrop filter values from `--blur-sm` to `--blur-3xl`

### 7. Shadows

- **Base Scale**: From `--shadow-xs` to `--shadow-2xl`
- **Semantic**: `--shadow-primary`, `--shadow-accent`, `--shadow-glow`
- **Interactive**: `--shadow-hover`, `--shadow-focus`

### 8. Z-Index

- **Layered System**: Consistent z-index values for different UI layers
- **Semantic**: `--z-dropdown`, `--z-modal`, `--z-toast`

## Usage Patterns

### In CSS

```css
.my-component {
  background: var(--glass-bg-light);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-card);
  padding: var(--card-padding);
  box-shadow: var(--shadow-card);
  transition: var(--transition-default);
}
```

### In Vue Components

```vue
<script setup>
import { tokens } from "@/tokens";

const buttonStyle = {
  padding: `${tokens.spacing.md} ${tokens.spacing.lg}`,
  borderRadius: tokens.borderRadius.button,
  background: tokens.colors.electric.blue,
};
</script>
```

### With Tailwind CSS

Tokens are integrated with Tailwind through CSS custom properties:

```html
<div class="bg-electric-blue text-white shadow-card rounded-card">Content</div>
```

## Best Practices

### 1. Use Semantic Tokens First

Prefer semantic tokens over literal values:

- ✅ `var(--text-primary)`
- ❌ `#FFFFFF`

### 2. Component-Specific Tokens

Use component-specific tokens for consistent spacing:

- ✅ `var(--card-padding)`
- ❌ `var(--space-6)`

### 3. Consistent Naming

Follow the established naming patterns:

- `--{category}-{variant}-{modifier}`
- Example: `--glass-bg-light`

### 4. Layer Tokens Appropriately

Use the token hierarchy:

1. Base tokens (colors, spacing)
2. Semantic tokens (text-primary, bg-card)
3. Component tokens (button-padding, card-radius)

## Migration Guide

When updating existing components to use design tokens:

1. **Identify hardcoded values**
2. **Find appropriate token replacement**
3. **Update CSS/styles**
4. **Test visual consistency**

### Example Migration

```css
/* Before */
.button {
  background: #00d4ff;
  padding: 12px 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* After */
.button {
  background: var(--electric-blue);
  padding: var(--button-padding-y) var(--button-padding-x);
  border-radius: var(--radius-button);
  box-shadow: var(--shadow-button);
}
```

## Benefits

1. **Consistency**: Unified visual language across the application
2. **Maintainability**: Single source of truth for design values
3. **Scalability**: Easy to add new values or modify existing ones
4. **Theming**: Simple to create variants or dark modes
5. **Developer Experience**: IntelliSense support and type safety
6. **Performance**: Reduced CSS bundle size through reuse
