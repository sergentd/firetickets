# UI-Tools-Vue: Comprehensive Test Plan

This document outlines a comprehensive strategy for testing the `ui-tools-vue` frontend application. It covers various testing categories, identifies key areas for testing, and describes the implementation approach to ensure code quality, functionality, and maintainability.

## I. Test Categories & Tools

We will utilize a multi-faceted testing approach, employing different categories of tests and tools:

*   **Unit Tests:**
    *   **Tool:** [Vitest](https://vitest.dev/)
    *   **Purpose:** To verify individual functions, classes, and small modules in isolation. These tests should be fast and focused on the smallest testable units of code.
    *   **Mocking Strategy:** External dependencies (e.g., API calls, global objects, other modules) are aggressively mocked to ensure test isolation and prevent side effects. For Firestore services, Firebase/Firestore SDK functions are mocked to avoid actual database interactions.

*   **Component Tests:**
    *   **Tools:** [Vitest](https://vitest.dev/) + [@vue/test-utils](https://test-utils.vuejs.org/)
    *   **Purpose:** To verify individual Vue components in isolation. This includes checking if they render correctly, respond to props, emit events, handle user interactions, and display content as expected.
    *   **Mocking Strategy:** Child components, Vue Router components (`RouterLink`), and global composables (`useId`) are mocked to isolate the component under test and simplify testing scenarios.

*   **Integration Tests:**
    *   **Tools:** [Vitest](https://vitest.dev/) + [@vue/test-utils](https://test-utils.vuejs.org/) (with mocked services)
    *   **Purpose:** To verify the interactions between multiple units or components. This often involves testing a Vue component's interaction with a service (e.g., a component calling a Firestore service).
    *   **Mocking Strategy:** External services (like Firestore) are mocked to simulate their behavior, allowing us to verify data flow and function calls between the component and the service without relying on a live backend.

*   **End-to-End (E2E) Tests:**
    *   **Tools:** (To be determined and set up: e.g., Cypress, Playwright)
    *   **Purpose:** To simulate real user scenarios across the entire application, interacting with the deployed frontend and actual backend services. These tests validate critical user journeys and the overall system integration.
    *   **Implementation Note:** E2E tests will be introduced in a later phase due to their higher setup complexity and longer execution times.

*   **Code Quality Checks:**
    *   **Tools:** [ESLint](https://eslint.org/), [Prettier](https://prettier.io/)
    *   **Purpose:** To enforce coding standards, identify potential issues, and maintain code consistency and readability across the project. These are typically run as part of the CI/CD pipeline.

## II. Areas to Test (Prioritized)

This section outlines the key areas of the application that require testing, prioritized based on their criticality and complexity.

### Phase 1: Core Functionality & Foundational Components (Current Focus)

1.  **Core Utilities (`frontend/src/utils/`)**
    *   `searchIndexer.js`: (Unit Tests implemented for `stripHtml`, `extractKeywords`, `slugify`, `extractTextContent`).
    *   `test-db.js`: (Review for relevance after persistence refactoring; likely to be removed).

2.  **UI Base Components (`frontend/src/components/ui/base/`)**
    *   `UIButton.vue`: (Component Tests implemented).
    *   `UIContainer.vue`: (Component Tests implemented).
    *   `UIGlassCard.vue`: (Component Tests implemented).
    *   `UISection.vue`: (Component Tests implemented).
    *   `UITabs.vue`: (Component Tests implemented).

3.  **UI Form Components (`frontend/src/components/ui/forms/`)**
    *   `UIInput.vue`: (Component Tests implemented).
    *   `UISelect.vue`: (Component Tests implemented).
    *   `UISlider.vue`: (Component Tests implemented).
    *   `UIToggle.vue`: (Component Tests implemented).

4.  **Firestore Services (`frontend/src/services/`)**
    *   `palettesFirestore.js`: (Unit Tests implemented for CRUD operations).
    *   `ticketsFirestore.js`: (Unit Tests implemented for CRUD operations, real-time subscriptions, user authentication checks, and `migrateFromLocalStorage`).
    *   `firebase.js`: (Configuration, initialization - primarily verified by integration tests that use the `db` instance).
    *   `auth.js`: (Unit Tests - user authentication functions like `getCurrentUser`, `signIn`, `signOut`, `onAuthStateChanged`).

5.  **Integration Tests (`frontend/__tests__/integration/`)**
    *   `SavedPalettes.integration.test.js`: (Integration Tests implemented for interaction between `SavedPalettes.vue` and `palettesFirestore.js`).

### Phase 2: Composables, Stores & Tool-Specific Logic

1.  **Composables (`frontend/src/composables/`)**
    *   `useSearchScanner.js`: (Unit Tests - logic for scanning components for search data).

2.  **Specific Tool Components (`frontend/src/components/tools/`)**
    *   **PaletteGenerator:**
        *   `PaletteGenerator.vue`: (Integration Tests - interaction with sub-components, saving/exporting palettes).
        *   `ColorGeneration.vue`, `ImageExtraction.vue`, `ManualColorInput.vue`, `PaletteDisplay.vue`: (Component Tests - rendering, prop handling, event emission, specific generation logic).
    *   **TicketingSystem:**
        *   `TicketingSystem.vue`: (Integration Tests - interaction with `ticketsFirestore`, `TicketCard`, modals, filters).
        *   `TicketCard.vue`, `NewTicketModal.vue`, `EditTicketModal.vue`, `FilterMenu.vue`: (Component Tests - rendering, prop handling, event emission, form submission).
    *   **Other Tools:** (`SkillsEvaluator.vue`, `ComponentLibrary.vue`, `CSSSpecificity.vue`, `ThemingMultiClient.vue`, `WebdevGlossary.vue`, `WebUIPrinciples.vue`, `MindMapper.vue`, etc.): Each will require dedicated component and/or integration tests based on their complexity and dependencies.

### Phase 3: Views, Routing & E2E

1.  **Views (`frontend/src/views/`)**
    *   `Home.vue`, `ToolView.vue`: (Component/Integration Tests - basic rendering, routing integration, data fetching).

2.  **Routing (`frontend/src/router/index.js`)**
    *   (Unit/Integration Tests - ensure routes are correctly defined, guarded, and accessible).

3.  **End-to-End (E2E) Tests:**
    *   Critical user flows (e.g., user login, creating a palette, managing tickets).

## III. Test Implementation Strategy

1.  **Incremental Development:** Tests are implemented alongside feature development or refactoring, ensuring that new code is covered and existing code remains functional.
2.  **Prioritize Critical Paths:** Focus testing efforts on the most important features and user flows first to ensure core functionality is robust.
3.  **Isolation:** For unit and component tests, external dependencies are mocked to ensure tests are fast, reliable, and truly test the isolated unit.
4.  **Realism for Integration/E2E:** As we move to integration and E2E tests, the level of mocking decreases, and tests interact with more realistic environments (mocked services for integration, actual services for E2E).
5.  **Code Coverage:** Aim for high code coverage (e.g., >80% for statements, branches, functions, lines) to ensure a significant portion of the codebase is exercised by tests.

## IV. How to Run Tests

All test commands should be executed from the `frontend/` directory.

*   **Run all tests:**
    ```bash
    npm run test
    ```
    This command uses `vitest` to discover and run all test files (ending with `.test.js` or `.spec.js`) within the project.

*   **Generate a test coverage report:**
    ```bash
    npm run test:coverage
    ```
    This command runs all tests and generates an HTML report (typically in a `coverage/` folder within `frontend/`). Open `frontend/coverage/index.html` in a web browser to view detailed coverage results.

## V. Documentation of Implemented Tests

### Test Documentation: Current Implementation

This document outlines the tests that have been implemented for the `ui-tools-vue` frontend application, categorized by their type and purpose.

**I. Test Categories & Tools Used:**

*   **Unit Tests:** Implemented using [Vitest](https://vitest.dev/).
    *   **Purpose:** Verify individual functions, classes, and small modules in isolation.
    *   **Mocking Strategy:** For Firestore services, Firebase/Firestore SDK functions are mocked using `vi.mock` to prevent actual database calls and ensure test isolation and speed. Global objects like `localStorage` are also mocked where necessary.
*   **Component Tests:** Implemented using [Vitest](https://vitest.dev/) and [@vue/test-utils](https://test-utils.vuejs.org/).
    *   **Purpose:** Verify individual Vue components in isolation, ensuring they render correctly, respond to props, emit events, and handle user interactions.
    *   **Mocking Strategy:** Child components (e.g., `IconSystem`) and Vue Router components (`RouterLink`) are mocked to isolate the component under test. Vue's `useId` composable is also mocked for consistent ID generation.
*   **Integration Tests:** Implemented using [Vitest](https://vitest.dev/) and [@vue/test-utils](https://test-utils.vuejs.org/).
    *   **Purpose:** Verify the interaction between multiple units or components, often involving a component interacting with a service.
    *   **Mocking Strategy:** Firebase/Firestore SDK functions are mocked to simulate their behavior, allowing us to verify data flow and function calls between the component and the service without relying on a live backend.

**II. Implemented Tests:**

1.  **Core Utilities (`frontend/src/utils/`)**
    *   **File:** `frontend/__tests__/utils/searchIndexer.test.js`
    *   **Type:** Unit Tests
    *   **Covers:**
        *   `stripHtml(html)`: Tests for removing HTML tags, replacing entities, handling empty strings, and normalizing spaces.
        *   `extractKeywords(text, minLength)`: Tests for extracting keywords, converting to lowercase, removing punctuation, filtering stop words (French), respecting minimum length, and returning unique keywords.
        *   `slugify(text)`: Tests for converting text to URL-friendly slugs, handling special characters/accents, replacing multiple spaces, trimming hyphens, and handling numbers.
        *   `extractTextContent(element)`: Tests for extracting text from simple and nested DOM elements, ignoring `<script>` and `<style>` tags, and handling empty or whitespace-only elements.
    *   **Purpose:** Ensures the foundational text processing and manipulation utilities function as expected.

2.  **UI Base Components (`frontend/src/components/ui/base/`)**
    *   **File:** `frontend/__tests__/components/ui/base/UIButton.test.js`
    *   **Type:** Component Tests
    *   **Covers:** The `UIButton.vue` component.
    *   **Test Cases:**
        *   Default rendering with `primary` variant and `md` size.
        *   Rendering of slot content.
        *   Application of `variant` and `size` classes.
        *   `disabled` state: button is disabled, no click event emitted.
        *   `loading` state: spinner shown, button disabled, slot content hidden.
        *   `icon` prop: `IconSystem` component rendered with correct props.
        *   `iconOnly`, `block`, `active` props: correct classes applied.
        *   `click` event emission when not disabled/loading.
        *   Rendering as `router-link` when `to` prop is provided.
        *   Rendering as `a` tag when `href` prop is provided.
    *   **Mocking:** `IconSystem.vue` and `vue-router`'s `RouterLink` are mocked to isolate `UIButton`.
    *   **Purpose:** Verifies the `UIButton` component's visual and interactive behavior under various configurations.

3.  **UI Form Components (`frontend/src/components/ui/forms/`)**
    *   **File:** `frontend/__tests__/components/ui/forms/UIInput.test.js`
    *   **Type:** Component Tests
    *   **Covers:** The `UIInput.vue` component.
    *   **Test Cases:**
        *   Default rendering with `text` type and `md` size.
        *   Two-way binding of `modelValue`.
        *   Rendering of `label`, `helperText`, and `error` messages.
        *   Different `type` props (e.g., `email`, `number`).
        *   Password visibility toggle for `password` type.
        *   `disabled` and `readonly` states.
        *   `size` and `variant` class application.
        *   `iconLeading` and `iconTrailing` rendering.
        *   `clearable` functionality (button visibility, clearing input, emitting `clear` event).
        *   Event emissions (`change`, `focus`, `blur`, `keydown`).
        *   Exposed methods (`focus`, `blur`, `select`).
    *   **Mocking:** `IconSystem.vue` is mocked. `useId` from `vue` is mocked for consistent ID generation.
    *   **Purpose:** Ensures the `UIInput` component functions correctly as a versatile form input, handling various configurations and user interactions.
        
    *   **File:** `frontend/__tests__/components/ui/forms/UISelect.test.js`
    *   **Type:** Component Tests
    *   **Covers:** The `UISelect.vue` component, including single/multiple selections, grouped options, and custom key handling.
    *   **Test Cases:**
        *   Default rendering of select element and options.
        *   Two-way binding of `modelValue` for single and multiple selections.
        *   Rendering of `label`, `helperText`, and `error` messages.
        *   Rendering options from simple arrays, object arrays (with default and custom keys), and grouped options.
        *   Placeholder option rendering.
        *   `disabled` and `required` states.
        *   `size` and `variant` class application.
        *   `iconLeading` rendering.
        *   Event emissions (`change`, `focus`, `blur`).
        *   Exposed methods (`focus`, `blur`).
    *   **Mocking:** `IconSystem.vue` is mocked. `useId` from `vue` is mocked for consistent ID generation.
    *   **Purpose:** Verifies the `UISelect` component's functionality for various selection scenarios and configurations.

4.  **Firestore Services (`frontend/src/services/`)**
    *   **File:** `frontend/__tests__/services/palettesFirestore.test.js`
    *   **Type:** Unit Tests
    *   **Covers:** The `palettesFirestore.js` service functions: `getPalettes`, `addPalette`, `updatePalette`, `deletePalette`.
    *   **Mocking:** All Firebase/Firestore SDK functions (`collection`, `getDocs`, `addDoc`, `doc`, `updateDoc`, `deleteDoc`, `serverTimestamp`) are mocked using `vi.mock`. The `db` object from `firebase.js` is also mocked.
    *   **Purpose:** Ensures that the palette-related Firestore operations correctly interact with the Firestore API (via mocks) and handle data as expected.

    *   **File:** `frontend/__tests__/services/ticketsFirestore.test.js`
    *   **Type:** Unit Tests
    *   **Covers:** The `ticketsFirestore.js` service functions: `loadTickets`, `subscribeToTickets`, `createTicket`, `updateTicket`, `deleteTicket`, `bulkDeleteTickets`, `migrateFromLocalStorage`.
    *   **Mocking:** Firebase/Firestore SDK functions are mocked. `getCurrentUser` from `./auth` is mocked to control authentication state. `localStorage` is mocked for `migrateFromLocalStorage` tests.
    *   **Purpose:** Verifies the ticket-related Firestore operations, including user authentication checks, real-time subscriptions, and the migration logic.

5.  **Integration Tests (`frontend/__tests__/integration/`)**
    *   **File:** `frontend/__tests__/integration/SavedPalettes.integration.test.js`
    *   **Type:** Integration Tests
    *   **Covers:** Interaction between `SavedPalettes.vue` component and `palettesFirestore.js` service.
    *   **Test Cases:**
        *   Loading and displaying palettes on component mount.
        *   Adding a new palette via the exposed `addPalette` method.
        *   Deleting a palette via UI interaction.
        *   Emitting `palette-loaded` event when a palette is selected.
        *   Clearing all palettes via UI interaction.
    *   **Mocking:** Firebase/Firestore SDK functions are mocked to simulate the backend. `window.confirm` is mocked for user interaction.
    *   **Purpose:** Ensures that the `SavedPalettes` component correctly uses the `palettesFirestore` service to manage palette data and updates its UI accordingly.

---