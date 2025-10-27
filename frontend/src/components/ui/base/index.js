/**
 * Base UI Components
 *
 * Core reusable UI building blocks that replace repetitive patterns
 * across the application. All components use design tokens for consistency.
 */

// Base components
export { default as UIButton } from "./UIButton.vue";
export { default as UIGlassCard } from "./UIGlassCard.vue";
export { default as UISection } from "./UISection.vue";
export { default as UIContainer } from "./UIContainer.vue";
export { default as UITabs } from "./UITabs.vue";

// Re-export everything as a single object for convenience
import UIButton from "./UIButton.vue";
import UIGlassCard from "./UIGlassCard.vue";
import UISection from "./UISection.vue";
import UIContainer from "./UIContainer.vue";
import UITabs from "./UITabs.vue";

export const BaseComponents = {
  UIButton,
  UIGlassCard,
  UISection,
  UIContainer,
  UITabs,
};

export default BaseComponents;
