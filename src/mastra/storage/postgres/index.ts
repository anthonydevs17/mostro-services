import { PostgresStore } from "@mastra/pg";
import { Memory } from "@mastra/memory";
import { PgVector } from "@mastra/pg";
import { openai } from "@ai-sdk/openai";

//storage for mastra
export const postgresStore = new PostgresStore({
  connectionString: process.env.DATABASE_URL!
});

//vector for mastra
export const pgVector = new PgVector(process.env.DATABASE_URL!);

//memory for mastra
export const pgMemory = new Memory({
  storage: postgresStore,
  vector: pgVector,
  embedder: openai.embedding("text-embedding-3-small"),
  options: { lastMessages: 10 }
});
