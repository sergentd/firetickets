# Design Tokens Usage Guide

This guide provides practical examples for using design tokens in the UI Tools Vue application.

## Quick Reference

### Most Common Tokens

```css
/* Spacing */
--space-xs: 0.25rem /* 4px */ --space-sm: 0.5rem /* 8px */ --space-md: 1rem
  /* 16px */ --space-lg: 1.5rem /* 24px */ --space-xl: 2rem /* 32px */
  /* Colors */ --electric-blue: #00d4ff --accent-red: #ff6b6b
  --text-primary: #ffffff --text-secondary: #b3b3b3 --bg-primary: #000000
  --bg-secondary: #0a0a0a /* Glass Effects */
  --glass-bg-light: rgba(18, 18, 18, 0.8)
  --glass-border-light: rgba(255, 255, 255, 0.1) --blur-lg: 12px
  /* Component Tokens */ --card-padding: 1.5rem --button-padding-x: 1.25rem
  --button-padding-y: 0.75rem --radius-button: 0.75rem --radius-card: 1.5rem;
```

## Common Usage Patterns

### 1. Card Components

```vue
<template>
  <div class="glass-card">
    <h3 class="card-title">Card Title</h3>
    <p class="card-content">Card content...</p>
    <button class="card-button">Action</button>
  </div>
</template>

<style scoped>
.glass-card {
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border-light);
  border-radius: var(--radius-card);
  padding: var(--card-padding);
  backdrop-filter: blur(var(--blur-lg));
  box-shadow: var(--shadow-card);
  transition: var(--transition-default);
}

.card-title {
  color: var(--text-primary);
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-md);
}

.card-content {
  color: var(--text-secondary);
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-lg);
}

.card-button {
  background: var(--electric-blue);
  color: var(--text-inverse);
  padding: var(--button-padding-y) var(--button-padding-x);
  border-radius: var(--radius-button);
  border: none;
  font-weight: var(--font-medium);
  transition: var(--transition-default);
}

.card-button:hover {
  background: var(--electric-blue-light);
  box-shadow: var(--shadow-glow);
}
</style>
```

### 2. Button Components

```vue
<template>
  <button
    :class="['btn', `btn-${variant}`, `btn-${size}`]"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<style scoped>
/* Base button styles */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: var(--radius-button);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: var(--transition-default);
  text-decoration: none;
}

/* Button variants */
.btn-primary {
  background: var(--electric-blue);
  color: var(--text-inverse);
  box-shadow: var(--shadow-button);
}

.btn-primary:hover {
  background: var(--electric-blue-light);
  box-shadow: var(--shadow-glow);
}

.btn-secondary {
  background: var(--glass-bg-light);
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
}

.btn-secondary:hover {
  background: var(--glass-bg-lighter);
  border-color: var(--border-hover);
}

.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
}

.btn-ghost:hover {
  background: var(--color-hover);
  color: var(--text-primary);
}

/* Button sizes */
.btn-sm {
  padding: var(--button-padding-sm-y) var(--button-padding-sm-x);
  font-size: var(--text-sm);
}

.btn-md {
  padding: var(--button-padding-y) var(--button-padding-x);
  font-size: var(--text-base);
}

.btn-lg {
  padding: var(--button-padding-lg-y) var(--button-padding-lg-x);
  font-size: var(--text-lg);
}

/* Button states */
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: var(--color-disabled);
}
</style>
```

### 3. Input Components

```vue
<template>
  <div class="input-group">
    <label v-if="label" class="input-label">{{ label }}</label>
    <input
      :class="['input-field', { 'input-error': error }]"
      :type="type"
      :placeholder="placeholder"
      v-model="modelValue"
    />
    <span v-if="error" class="input-error-text">{{ error }}</span>
  </div>
</template>

<style scoped>
.input-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.input-label {
  color: var(--text-primary);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
}

.input-field {
  background: var(--glass-bg-input);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-input);
  padding: var(--input-padding-y) var(--input-padding-x);
  color: var(--text-primary);
  font-size: var(--text-base);
  transition: var(--transition-default);
}

.input-field::placeholder {
  color: var(--text-tertiary);
}

.input-field:focus {
  outline: none;
  border-color: var(--border-focus);
  box-shadow: var(--shadow-focus);
}

.input-field.input-error {
  border-color: var(--color-error);
}

.input-error-text {
  color: var(--color-error);
  font-size: var(--text-xs);
}
</style>
```

### 4. Section/Container Components

```vue
<template>
  <section class="tool-section">
    <header class="section-header">
      <h2 class="section-title">{{ title }}</h2>
      <p v-if="description" class="section-description">{{ description }}</p>
    </header>
    <div class="section-content">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.tool-section {
  background: var(--glass-bg-section);
  border: 1px solid var(--glass-border-lighter);
  border-radius: var(--radius-card);
  padding: var(--card-padding);
  backdrop-filter: blur(var(--blur-md));
}

.section-header {
  margin-bottom: var(--section-gap-sm);
}

.section-title {
  color: var(--text-primary);
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-sm);
}

.section-description {
  color: var(--text-secondary);
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
}

.section-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}
</style>
```

## JavaScript Usage

### In Composables

```javascript
// composables/useTheme.js
import { tokens } from "@/tokens";

export function useTheme() {
  const getTokenValue = (tokenPath) => {
    const keys = tokenPath.split(".");
    return keys.reduce((obj, key) => obj?.[key], tokens);
  };

  const applyGlassEffect = (element, variant = "light") => {
    const styles = {
      background: tokens.glass.background[variant],
      border: `1px solid ${tokens.glass.border.light}`,
      backdropFilter: `blur(${tokens.glass.blur.lg})`,
      borderRadius: tokens.borderRadius.card,
    };

    Object.assign(element.style, styles);
  };

  return {
    tokens,
    getTokenValue,
    applyGlassEffect,
  };
}
```

### In Components

```vue
<script setup>
import { computed } from "vue";
import { tokens } from "@/tokens";

const props = defineProps({
  variant: {
    type: String,
    default: "primary",
  },
  size: {
    type: String,
    default: "md",
  },
});

const dynamicStyles = computed(() => ({
  padding: `${tokens.spacing[props.size]} ${tokens.spacing.lg}`,
  background:
    props.variant === "primary"
      ? tokens.colors.electric.blue
      : tokens.glass.background.light,
  borderRadius: tokens.borderRadius.button,
  transition: tokens.animation.transition.default,
}));
</script>

<template>
  <button :style="dynamicStyles">
    <slot />
  </button>
</template>
```

## Migration Examples

### Before (Hardcoded Values)

```css
.old-card {
  background: rgba(18, 18, 18, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.old-button {
  background: #00d4ff;
  color: #000000;
  padding: 12px 20px;
  border-radius: 12px;
  font-weight: 600;
}
```

### After (Using Tokens)

```css
.new-card {
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border-light);
  border-radius: var(--radius-card);
  padding: var(--card-padding);
  box-shadow: var(--shadow-card);
  transition: var(--transition-default);
}

.new-button {
  background: var(--electric-blue);
  color: var(--text-inverse);
  padding: var(--button-padding-y) var(--button-padding-x);
  border-radius: var(--radius-button);
  font-weight: var(--font-semibold);
}
```

## Utility Classes

Common utility classes using design tokens:

```css
/* Spacing utilities */
.p-card {
  padding: var(--card-padding);
}
.gap-section {
  gap: var(--section-gap);
}
.mb-lg {
  margin-bottom: var(--space-lg);
}

/* Color utilities */
.text-primary {
  color: var(--text-primary);
}
.text-accent {
  color: var(--text-accent);
}
.bg-glass {
  background: var(--glass-bg-light);
}

/* Interactive utilities */
.hover-lift {
  transition: var(--transition-default);
}
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}

.focus-ring:focus {
  outline: none;
  box-shadow: var(--shadow-focus);
}
```

## Best Practices Summary

1. **Always use tokens instead of hardcoded values**
2. **Prefer semantic tokens over literal values**
3. **Use component-specific tokens for consistency**
4. **Combine tokens for complex effects**
5. **Test across different themes/variants**
6. **Document custom token combinations**

This system provides a solid foundation for consistent, maintainable styling across the entire application.
