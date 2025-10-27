# Ticket System - Planned Improvements

This document tracks approved enhancements for the Ticketing System UI and functionality.

---

## 🎨 Visual Enhancements

### ✅ 1. Tab Icons & Counts
- **Status**: Approved
- **Requirements**:
  - Add counts to tabs (like main tickets tab)
  - **NO EMOJI** - use SVG icons only
  - Example: `Détails | Pièces jointes (3) | Commentaires (5) | Activité`
- **Priority**: High

### ✅ 2. Better Empty States
- **Status**: Approved
- **Requirements**:
  - Add visual interest to empty states
  - Include helpful text like "Glissez-déposez des fichiers ici ou cliquez pour parcourir"
  - Small icon/illustration
- **Priority**: Medium

### ✅ 3. Relative Dates
- **Status**: Approved
- **Requirements**:
  - 24-hour threshold for relative dates
  - Within 24h: Show "il y a 2 heures" (larger)
  - After 24h: Show plain date with delta hours below (smaller)
  - Example format:
    ```
    16/10/2025 14:30
    il y a 2 heures
    ```
- **Priority**: High

### ✅ 4. Visual Due Date Indicators
- **Status**: Approved
- **Requirements**:
  - Add visual urgency indicators to due date field
  - **Use SVG icons (NO EMOJI)** via IconSystem.vue
  - Color coding:
    - Overdue (past due date): Red background + warning icon + "EN RETARD!"
    - Due today: Orange background + bell icon + "Aujourd'hui"
    - Due tomorrow: Yellow background + clock icon + "Demain"
    - Due within 48h: Yellow background + clock icon + "Dans X heures"
  - Visual feedback should be on the date input field or adjacent label
- **Priority**: High

### ✅ 5. File Thumbnails for Images
- **Status**: Approved
- **Requirements**:
  - Show small preview thumbnails for image attachments
  - Replace generic paperclip icon
- **Priority**: Medium

---

## ⚡ Functional Improvements

### ✅ 1. Drag & Drop Upload
- **Status**: Approved
- **Requirements**:
  - Make entire attachments area a drop zone
  - Visual feedback on drag-over
  - Support multiple files
- **Priority**: High

### ✅ 2. Inline Image Preview
- **Status**: Approved
- **Requirements**:
  - Add modal/lightbox for image previews
  - Don't open new tab for images
- **Priority**: Medium

### ✅ 3. Comment Edit Functionality
- **Status**: Approved (partial)
- **Requirements**:
  - **ONLY** edit button for user's own comments
  - No delete, no rich text, no @mentions, no reactions
- **Priority**: Medium

### ✅ 4. Activity Icons
- **Status**: Approved
- **Requirements**:
  - **NO EMOJI - ONLY SVG** icons
  - Use existing `IconSystem.vue` component
  - Different icons for different activity types:
    - Edit
    - Comment
    - Attachment added
    - Status changed
    - Priority changed
- **Priority**: High

### ✅ 5. Quick Actions Menu
- **Status**: Approved - "very good idea!"
- **Requirements**:
  - Add action buttons at top of panel:
    - Duplicate ticket
    - Print/Export
    - Share link
    - Archive
- **Priority**: High

### ❌ 6. Keyboard Shortcuts
- **Status**: Rejected
- **Priority**: N/A

### ✅ 7. Toast Notifications
- **Status**: Approved
- **Requirements**:
  - Replace `alert()` with toast notifications
  - Examples:
    - "Fichier téléchargé avec succès"
    - "Pièce jointe supprimée"
    - "Modifications enregistrées"
- **Priority**: High

---

## 🏗️ Structural Improvements

### ✅ 1. Metadata Sidebar
- **Status**: Approved - "very very good idea"
- **Requirements**:
  - Move "Informations" card to persistent sidebar
  - Show:
    - Created by/date
    - Last modified by/date
    - Ticket age
    - Time tracking (if added later)
- **Priority**: High

### 🤔 2. Related Tickets Section
- **Status**: Approved with uncertainty
- **Note**: "Maybe in its own tab? idk where, but I like the idea"
- **Requirements**: TBD - need to decide placement
- **Priority**: Low (decide location first)

### ❌ 3. Tags/Labels
- **Status**: Rejected
- **Priority**: N/A

### ❌ 4. Watchers/Assignees
- **Status**: Rejected
- **Reason**: "only one user, me"
- **Priority**: N/A

---

## 🚀 Performance & Polish

### ❌ 1. Optimistic Updates
- **Status**: Rejected
- **Priority**: N/A

### ❌ 2. Loading States (Skeleton)
- **Status**: Rejected
- **Priority**: N/A

### ✅ 3. Confirmation Modals
- **Status**: Approved
- **Requirements**:
  - Replace `confirm()` dialogs with styled modal components
  - Consistent design with app theme
- **Priority**: Medium

### 🔮 4. Attachment Search
- **Status**: Deferred
- **Note**: "Not yet. maybe in future"
- **Priority**: Future

### ✅ 5. Auto-save Draft
- **Status**: Approved - "very good idea"
- **Requirements**:
  - Save form changes to localStorage every few seconds
  - Prevent data loss on accidental close
  - Show indicator when draft is saved
- **Priority**: High

---

## 📋 Implementation Priority

### High Priority (Do First)
1. ✅ Tab Icons & Counts (no emoji)
2. ✅ Relative Dates (24h threshold)
3. ✅ Visual Due Date Indicators (SVG icons)
4. ✅ Activity Icons (SVG only via IconSystem.vue)
5. ✅ Quick Actions Menu
6. ✅ Toast Notifications
7. ✅ Metadata Sidebar
8. ✅ Drag & Drop Upload
9. ✅ Auto-save Draft

### Medium Priority
1. ✅ Better Empty States
2. ✅ File Thumbnails
3. ✅ Inline Image Preview
4. ✅ Comment Edit Button
5. ✅ Confirmation Modals

### Low Priority / TBD
1. 🤔 Related Tickets Section (needs location decision)

### Future Considerations
1. 🔮 Attachment Search

### Rejected
1. ❌ Emoji usage (use SVG icons instead)
2. ❌ Keyboard Shortcuts
3. ❌ Tags/Labels
4. ❌ Watchers/Assignees
5. ❌ Optimistic Updates
6. ❌ Loading States (Skeleton)

---

## 📝 Important Notes

- **NO EMOJI ANYWHERE** - Always use SVG icons via IconSystem.vue
- Single user application - no collaboration features needed
- Focus on simplicity and polish over complex features
- Maintain existing design system and color scheme

---

## 🔄 Status Legend

- ✅ Approved
- ❌ Rejected
- ⏸️ Pending clarification
- 🤔 Approved but needs planning
- 🔮 Future consideration

---

*Last updated: 2025-10-24*
