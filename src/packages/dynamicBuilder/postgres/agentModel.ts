import { z } from "zod";
import { db } from "./db";
import { agentConfig, type NewAgentConfig, type AgentConfig } from "./schema";
import { eq, and, or } from "drizzle-orm";

class AgentError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message);
    this.name = "AgentError";
  }
}

const DynamicBuilderDBSchema = z.object({
  resourceId: z.string()
});

const CreateAgentSchema = z.object({
  resourceId: z.string(),
  identifier: z.string(),
  name: z.string(),
  description: z.string().optional(),
  model: z.string(),
  temperature: z.number().min(0).max(1).default(0.7),
  maxTokens: z.number().optional(),
  instructions: z.string().optional()
});

const ListAgentsSchema = z.object({
  resourceId: z.string().optional()
});

type AgentResponse = Pick<
  AgentConfig,
  | "resourceId"
  | "identifier"
  | "name"
  | "description"
  | "model"
  | "temperature"
  | "maxTokens"
  | "instructions"
>;

export async function createAgent(
  input: z.infer<typeof CreateAgentSchema>
): Promise<AgentConfig> {
  try {
    const data = CreateAgentSchema.parse(input);

    // Check if agent with same resourceId already exists
    const existingAgent = await db.query.agentConfig.findFirst({
      where: eq(agentConfig.resourceId, data.resourceId)
    });

    if (existingAgent) {
      throw new AgentError(
        `Agent with resourceId ${data.resourceId} already exists`,
        "AGENT_EXISTS"
      );
    }

    const [agent] = await db.insert(agentConfig).values(data).returning();

    if (!agent) {
      throw new AgentError("Failed to create agent", "CREATE_FAILED");
    }

    return agent;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new AgentError(
        `Invalid input data: ${error.errors.map(e => e.message).join(", ")}`,
        "INVALID_INPUT"
      );
    }
    if (error instanceof AgentError) {
      throw error;
    }
    throw new AgentError(
      "Unexpected error while creating agent",
      "UNKNOWN_ERROR"
    );
  }
}

export async function getAgentById(id: string): Promise<AgentConfig> {
  try {
    const [agent] = await db
      .select()
      .from(agentConfig)
      .where(eq(agentConfig.id, id));

    if (!agent) {
      throw new AgentError(`No agent found with ID: ${id}`, "AGENT_NOT_FOUND");
    }

    return agent;
  } catch (error) {
    if (error instanceof AgentError) {
      throw error;
    }
    throw new AgentError(
      "Unexpected error while fetching agent",
      "UNKNOWN_ERROR"
    );
  }
}

export async function listAgents(
  input: z.infer<typeof ListAgentsSchema> = {}
): Promise<AgentConfig[]> {
  try {
    const { resourceId } = ListAgentsSchema.parse(input);

    const query = db.select().from(agentConfig);

    if (resourceId) {
      query.where(eq(agentConfig.resourceId, resourceId));
    }

    const agents = await query.execute();

    if (!agents) {
      throw new AgentError("Failed to fetch agents", "FETCH_FAILED");
    }

    return agents;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new AgentError(
        `Invalid input data: ${error.errors.map(e => e.message).join(", ")}`,
        "INVALID_INPUT"
      );
    }
    if (error instanceof AgentError) {
      throw error;
    }
    throw new AgentError(
      "Unexpected error while listing agents",
      "UNKNOWN_ERROR"
    );
  }
}

export async function dynamicBuilderDB(
  input: z.infer<typeof DynamicBuilderDBSchema>
): Promise<AgentResponse> {
  try {
    const { resourceId } = DynamicBuilderDBSchema.parse(input);

    const config = await db.query.agentConfig.findFirst({
      where: eq(agentConfig.resourceId, resourceId)
    });

    if (!config) {
      throw new AgentError(
        `No configuration found for resource ID: ${resourceId}`,
        "CONFIG_NOT_FOUND"
      );
    }

    return {
      resourceId: config.resourceId,
      identifier: config.identifier,
      name: config.name,
      description: config.description,
      model: config.model,
      temperature: config.temperature,
      maxTokens: config.maxTokens,
      instructions: config.instructions
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new AgentError(
        `Invalid input data: ${error.errors.map(e => e.message).join(", ")}`,
        "INVALID_INPUT"
      );
    }
    if (error instanceof AgentError) {
      throw error;
    }
    throw new AgentError(
      "Unexpected error while building dynamic configuration",
      "UNKNOWN_ERROR"
    );
  }
}
