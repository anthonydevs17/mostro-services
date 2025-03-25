import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { listAgents, getAgentById as getAgentConfigById } from "./agentModel";

export class DynamicAgentBuilder {
  constructor() {}

  private validateAgentConfig(config: any) {
    if (!config.resourceId || !config.name || !config.model) {
      throw new Error(
        `Invalid agent configuration for agent: ${config.resourceId || "unknown"}`
      );
    }
  }

  public async buildAgents(
    resourceId?: string
  ): Promise<Record<string, Agent>> {
    try {
      // Fetch agent configurations using agentModel
      const agentsConfig = await listAgents({ resourceId });
      const agents: Record<string, Agent> = {};

      for (const config of agentsConfig) {
        this.validateAgentConfig(config);

        agents[config.identifier] = new Agent({
          name: config.name,
          instructions: config.instructions || "",
          model: openai(config.model)
        });
      }

      return agents;
    } catch (error) {
      console.error("Error building dynamic agents:", error);
      throw new Error(`Failed to build dynamic agents: ${error}`);
    }
  }

  public async getAgentById(id: string): Promise<Agent | null> {
    try {
      const config = await getAgentConfigById(id);
      this.validateAgentConfig(config);

      return new Agent({
        name: config.name,
        instructions: config.instructions || "",
        model: openai(config.model)
      });
    } catch (error) {
      console.error(`Error getting agent with ID ${id}:`, error);
      return null;
    }
  }
}

// Export a singleton instance
export const dynamicAgentBuilder = new DynamicAgentBuilder();

export const dynamicAgents = await dynamicAgentBuilder.buildAgents();
