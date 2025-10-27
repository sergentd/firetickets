/**
 * Data Persistence Type Definitions
 *
 * Centralized TypeScript interfaces for all persisted entities in the application.
 * Each interface extends BaseEntity for consistent metadata tracking.
 */

/**
 * Base interface for all persisted entities
 */
export interface BaseEntity {
  id?: number; // Auto-incremented by IndexedDB
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
  version: number; // Schema version for this entity
}

/**
 * Color Palette
 */
export interface Palette extends BaseEntity {
  name: string;
  colors: string[]; // Array of hex colors
  tags?: string[];
  description?: string;
}

/**
 * Ticket/Task
 */
export interface Ticket extends BaseEntity {
  title: string;
  description: string;
  customer?: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "todo" | "in-progress" | "waiting" | "completed";
  dueDate?: string;
  completedAt?: string;
  type: "callback" | "task";
  callbackTime?: string;
  tags?: string[];
}

/**
 * Mind Map Node (Recursive structure)
 */
export interface MindMapNode {
  id: number;
  text: string;
  x: number;
  y: number;
  color: string;
  shape: "rect" | "ellipse";
  children: MindMapNode[];
}

/**
 * Mind Map Document
 */
export interface MindMap extends BaseEntity {
  name: string;
  root: MindMapNode;
  connector: "curved" | "straight" | "elbow";
  zoom: number;
  pan: { x: number; y: number };
}

/**
 * Checklist Page (WebUI Principles)
 */
export interface ChecklistPage {
  name: string;
  checks: Record<string, 0 | 1 | 2>; // ruleId -> status (0=todo, 1=validated, 2=problem)
}

/**
 * Checklist Document
 */
export interface Checklist extends BaseEntity {
  projectName: string;
  pages: ChecklistPage[];
}

/**
 * Skill within a category
 */
export interface Skill {
  name: string;
  level: 0 | 1 | 2 | 3 | 4 | 5; // 0=none, 5=expert
}

/**
 * Skill Category
 */
export interface SkillCategory {
  name: string;
  skills: Skill[];
}

/**
 * Skills Profile
 */
export interface SkillsProfile extends BaseEntity {
  userId?: string; // For future multi-user support
  categories: SkillCategory[];
  customSkills?: Skill[];
}

/**
 * Tool Configuration (for generator tools)
 */
export interface ToolConfig extends BaseEntity {
  toolId: string; // e.g., 'gradient-generator'
  config: Record<string, any>; // Tool-specific config
  isSession: boolean; // If true, expires after session
}

/**
 * User Preferences
 */
export interface UserPreferences {
  theme?: "light" | "dark" | "auto";
  language?: string;
  favorites: string[]; // Tool IDs
  defaultToolConfigs?: Record<string, any>;
  updatedAt: string;
}

/**
 * Metadata entries (key-value store for app metadata)
 */
export interface MetadataEntry {
  key: string;
  value: any;
  updatedAt: string;
}

/**
 * Export/Backup Format
 */
export interface DataExport {
  version: string;
  exportedAt: string;
  application: string;
  data: {
    palettes?: Palette[];
    tickets?: Ticket[];
    mindmaps?: MindMap[];
    checklists?: Checklist[];
    skills?: SkillsProfile[];
    toolConfigs?: ToolConfig[];
    preferences?: UserPreferences;
  };
  checksum: string;
}

/**
 * Storage Statistics
 */
export interface StorageStats {
  quota: number;
  usage: number;
  percentage: number;
  collections: Record<string, number>; // Collection name -> item count
}

/**
 * Validation Result
 */
export interface ValidationResult {
  valid: boolean;
  data?: any;
  error?: string;
}

/**
 * Import Result
 */
export interface ImportResult {
  success: boolean;
  imported: string[]; // List of imported collections
  errors: string[];
  message: string;
}

/**
 * Migration Result
 */
export interface MigrationResult {
  success: boolean;
  migratedFrom: number;
  migratedTo: number;
  affectedItems: number;
  errors?: string[];
}
