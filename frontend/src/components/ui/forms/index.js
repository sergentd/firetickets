/**
 * Form UI Components
 *
 * Reusable form input components that provide consistent styling,
 * validation, and accessibility features across the application.
 */

// Form components
export { default as UIInput } from "./UIInput.vue";
export { default as UISelect } from "./UISelect.vue";
export { default as UISlider } from "./UISlider.vue";
export { default as UIToggle } from "./UIToggle.vue";

// Re-export everything as a single object for convenience
import UIInput from "./UIInput.vue";
import UISelect from "./UISelect.vue";
import UISlider from "./UISlider.vue";
import UIToggle from "./UIToggle.vue";

export const FormComponents = {
  UIInput,
  UISelect,
  UISlider,
  UIToggle,
};

export default FormComponents;
