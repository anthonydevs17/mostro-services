import {
  pgTable,
  uuid,
  varchar,
  text,
  real,
  integer,
  timestamp
} from "drizzle-orm/pg-core";

export const agentConfig = pgTable("mastra_agents", {
  id: uuid("id").primaryKey().defaultRandom(),
  resourceId: varchar("resource_id", { length: 256 }).unique().notNull(),
  identifier: varchar("identifier", { length: 256 }).notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  description: text("description"),
  model: varchar("model", { length: 256 }).notNull(),
  temperature: real("temperature").default(0.7).notNull(),
  maxTokens: integer("max_tokens"),
  instructions: text("instructions"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export type AgentConfig = typeof agentConfig.$inferSelect;
export type NewAgentConfig = typeof agentConfig.$inferInsert;
