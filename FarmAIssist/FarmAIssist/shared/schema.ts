import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  mobile: text("mobile"),
  email: text("email"),
  location: text("location"),
  crops: text("crops"),
  preferredLanguage: text("preferred_language").notNull().default("malayalam"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const queries = pgTable("queries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  question: text("question").notNull(),
  answer: text("answer"),
  language: text("language").notNull(),
  type: text("type").notNull(), // 'text', 'voice', 'image'
  category: text("category"),
  imageUrl: text("image_url"),
  rating: text("rating"), // 'helpful', 'not-helpful'
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const advisoryContent = pgTable("advisory_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  titleMalayalam: text("title_malayalam"),
  description: text("description").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  language: text("language").notNull(),
  tags: text("tags").array(),
  views: integer("views").notNull().default(0),
  trending: text("trending").notNull().default("false"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  mobile: true,
  email: true,
  location: true,
  crops: true,
  preferredLanguage: true,
});

export const insertQuerySchema = createInsertSchema(queries).omit({
  id: true,
  createdAt: true,
});

export const insertAdvisorySchema = createInsertSchema(advisoryContent).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertQuery = z.infer<typeof insertQuerySchema>;
export type Query = typeof queries.$inferSelect;
export type InsertAdvisory = z.infer<typeof insertAdvisorySchema>;
export type Advisory = typeof advisoryContent.$inferSelect;
