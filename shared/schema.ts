import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const evaluations = pgTable("evaluations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  videoUrl: text("video_url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  status: text("status").notNull().default("processing"), // processing, completed, failed
  overallScore: integer("overall_score"),
  confidenceScore: integer("confidence_score"),
  facialExpressionsScore: integer("facial_expressions_score"),
  eyeContactScore: integer("eye_contact_score"),
  bodyLanguageScore: integer("body_language_score"),
  feedback: jsonb("feedback").$type<FeedbackItem[]>(),
  analysisDetails: jsonb("analysis_details").$type<AnalysisDetails>(),
});

export type FeedbackItem = {
  type: "positive" | "negative" | "neutral";
  message: string;
  timestamp?: number;
}

export type ExpressionData = {
  neutral: number;
  happy: number;
  sad: number;
  angry: number;
  fearful: number;
  disgusted: number;
  surprised: number;
}

export type TimelineData = {
  time: string;
  confidence: number;
}

export type AnalysisDetails = {
  expressionDistribution: ExpressionData;
  timeline: TimelineData[];
  eyeContactPercentage?: number;
  postureFeedback?: string[];
  gestureFeedback?: string[];
}

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertEvaluationSchema = createInsertSchema(evaluations).pick({
  userId: true,
  title: true,
  videoUrl: true,
});

export const updateEvaluationSchema = createInsertSchema(evaluations).pick({
  status: true,
  overallScore: true, 
  confidenceScore: true,
  facialExpressionsScore: true,
  eyeContactScore: true,
  bodyLanguageScore: true,
  feedback: true,
  analysisDetails: true,
}).partial();

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertEvaluation = z.infer<typeof insertEvaluationSchema>;
export type Evaluation = typeof evaluations.$inferSelect;
export type UpdateEvaluation = z.infer<typeof updateEvaluationSchema>;
