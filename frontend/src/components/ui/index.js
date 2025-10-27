/**
 * UI Components Library
 *
 * Central export point for all shared UI components in the application.
 * This provides a unified import interface for consuming components.
 */

// Base components
export * from "./base";
export { default as BaseComponents } from "./base";

// Form components
export * from "./forms";
export { default as FormComponents } from "./forms";

// Individual component exports for direct imports
export { default as UIButton } from "./base/UIButton.vue";
export { default as UIGlassCard } from "./base/UIGlassCard.vue";
export { default as UISection } from "./base/UISection.vue";
export { default as UIContainer } from "./base/UIContainer.vue";
export { default as UITabs } from "./base/UITabs.vue";
export { default as UIInput } from "./forms/UIInput.vue";
export { default as UISelect } from "./forms/UISelect.vue";

// Existing UI components (to maintain compatibility)
export { default as IconSystem } from "./IconSystem.vue";
export { default as GlassCard } from "./GlassCard.vue";
export { default as ToolCard } from "./ToolCard.vue";
export { default as FilterMenu } from "./FilterMenu.vue";
export { default as AppHeader } from "./AppHeader.vue";
export { default as AppFooter } from "./AppFooter.vue";
export { default as ToolHeader } from "./ToolHeader.vue";
export { default as CodeBlock } from "./CodeBlock.vue";
export { default as ControlPanel } from "./ControlPanel.vue";
export { default as PreviewPanel } from "./PreviewPanel.vue";
export { default as PresetSelector } from "./PresetSelector.vue";
export { default as CodeOutput } from "./CodeOutput.vue";

// All components grouped by category
import * as Base from "./base";
import * as Forms from "./forms";

export const UIComponents = {
  Base,
  Forms,
};

export default UIComponents;
