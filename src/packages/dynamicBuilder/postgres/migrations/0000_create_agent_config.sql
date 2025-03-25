CREATE TABLE IF NOT EXISTS "mastra_agents" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "resource_id" varchar(256) UNIQUE NOT NULL,
  "identifier" varchar(256) NOT NULL,
  "name" varchar(256) NOT NULL,
  "description" text,
  "model" varchar(256) NOT NULL,
  "temperature" float NOT NULL DEFAULT 0.7,
  "max_tokens" integer,
  "instructions" text,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
); 