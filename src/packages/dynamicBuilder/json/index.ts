import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

interface AgentConfig {
  id: string;
  name: string;
  instructions: string;
  tools?: string[];
  model: string;
}

export class DynamicAgentBuilder {
  private agentsConfigPath: string;

  constructor(configPath?: string) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    this.agentsConfigPath =
      configPath || path.resolve(__dirname, "../../agents.json");
  }

  private loadAgentsConfig(): AgentConfig[] {
    try {
      const configContent = fs.readFileSync(this.agentsConfigPath, "utf-8");
      return JSON.parse(configContent);
    } catch (error) {
      throw new Error(`Failed to load agents config: ${error}`);
    }
  }

  private validateAgentConfig(config: AgentConfig) {
    if (!config.id || !config.name || !config.instructions || !config.model) {
      throw new Error(
        `Invalid agent configuration for agent: ${config.id || "unknown"}`
      );
    }
  }

  public buildAgents(): Record<string, Agent> {
    const agentsConfig = this.loadAgentsConfig();
    const agents: Record<string, Agent> = {};

    for (const config of agentsConfig) {
      this.validateAgentConfig(config);

      agents[config.id] = new Agent({
        name: config.name,
        instructions: config.instructions,
        model: openai(config.model)
        // tools: config.tools || []
      });
    }

    return agents;
  }
}

export const dynamicAgentBuilder = new DynamicAgentBuilder();
