/**
 * Data Validation Service using Zod
 *
 * Validates all data before saving to ensure schema compliance and data integrity.
 * Prevents corrupt data from breaking the application.
 */

import { z } from "zod";
import type { ValidationResult } from "@/types/persistence";

/**
 * Zod schemas for runtime validation
 */

const PaletteSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1).max(100),
  colors: z
    .array(z.string().regex(/^#[0-9A-Fa-f]{6}$/))
    .min(1)
    .max(20),
  tags: z.array(z.string().max(50)).max(10).optional(),
  description: z.string().max(500).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  version: z.number(),
});

const TicketSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1).max(200),
  description: z.string().max(5000),
  customer: z.string().max(200).optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  status: z.enum(["todo", "in-progress", "waiting", "completed"]),
  dueDate: z.string().datetime().optional(),
  completedAt: z.string().datetime().optional(),
  type: z.enum(["callback", "task"]),
  callbackTime: z.string().optional(),
  tags: z.array(z.string().max(50)).max(10).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  version: z.number(),
});

const MindMapNodeSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    id: z.number(),
    text: z.string().max(500),
    x: z.number(),
    y: z.number(),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    shape: z.enum(["rect", "ellipse"]),
    children: z.array(MindMapNodeSchema),
  }),
);

const MindMapSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1).max(200),
  root: MindMapNodeSchema,
  connector: z.enum(["curved", "straight", "elbow"]),
  zoom: z.number().min(0.1).max(5),
  pan: z.object({
    x: z.number(),
    y: z.number(),
  }),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  version: z.number(),
});

const ChecklistPageSchema = z.object({
  name: z.string().max(200),
  checks: z.record(
    z.string(),
    z.union([z.literal(0), z.literal(1), z.literal(2)]),
  ),
});

const ChecklistSchema = z.object({
  id: z.number().optional(),
  projectName: z.string().min(1).max(200),
  pages: z.array(ChecklistPageSchema),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  version: z.number(),
});

const SkillSchema = z.object({
  name: z.string().max(100),
  level: z.union([
    z.literal(0),
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
  ]),
});

const SkillCategorySchema = z.object({
  name: z.string().max(100),
  skills: z.array(SkillSchema),
});

const SkillsProfileSchema = z.object({
  id: z.number().optional(),
  userId: z.string().optional(),
  categories: z.array(SkillCategorySchema),
  customSkills: z.array(SkillSchema).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  version: z.number(),
});

const ToolConfigSchema = z.object({
  id: z.number().optional(),
  toolId: z.string().max(100),
  config: z.record(z.string(), z.any()),
  isSession: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  version: z.number(),
});

const UserPreferencesSchema = z.object({
  theme: z.enum(["light", "dark", "auto"]).optional(),
  language: z.string().optional(),
  favorites: z.array(z.string()),
  defaultToolConfigs: z.record(z.string(), z.any()).optional(),
  updatedAt: z.string().datetime(),
});

/**
 * Validation Service
 */
export class ValidationService {
  /**
   * Validate data against schema for a given collection
   */
  static validate(collection: string, data: any): ValidationResult {
    try {
      let validatedData: any;

      switch (collection) {
        case "palettes":
          validatedData = PaletteSchema.parse(data);
          break;
        case "tickets":
          validatedData = TicketSchema.parse(data);
          break;
        case "mindmaps":
          validatedData = MindMapSchema.parse(data);
          break;
        case "checklists":
          validatedData = ChecklistSchema.parse(data);
          break;
        case "skills":
          validatedData = SkillsProfileSchema.parse(data);
          break;
        case "toolConfigs":
          validatedData = ToolConfigSchema.parse(data);
          break;
        case "preferences":
          validatedData = UserPreferencesSchema.parse(data);
          break;
        default:
          throw new Error(`Unknown collection: ${collection}`);
      }

      return { valid: true, data: validatedData };
    } catch (error: any) {
      return {
        valid: false,
        error: error.message || "Validation failed",
      };
    }
  }

  /**
   * Sanitize string input to prevent XSS
   */
  static sanitize(input: string): string {
    return input
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;");
  }

  /**
   * Sanitize object recursively
   */
  static sanitizeObject(obj: any): any {
    if (typeof obj === "string") {
      return this.sanitize(obj);
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.sanitizeObject(item));
    }

    if (typeof obj === "object" && obj !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = this.sanitizeObject(value);
      }
      return sanitized;
    }

    return obj;
  }
}
