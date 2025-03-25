import { Mastra } from "@mastra/core";
import { createLogger } from "@mastra/core/logger";
import { VercelDeployer } from "../packages/deployers/vercel/src";
import { webSearchAgent, dataAnalysisAgent } from "./agents";
import { researchNetwork } from "./networks";
import { dynamicAgents } from "../packages/dynamicBuilder/postgres";
import { pgVector, postgresStore } from "./storage/postgres";
import { OTLPStorageExporter } from "@mastra/core/telemetry";

export const mastra = new Mastra({
  agents: {
    webSearchAgent,
    dataAnalysisAgent,
    ...dynamicAgents
  },
  vectors: { pgVector },
  storage: postgresStore,
  networks: { researchNetwork },
  logger: createLogger({
    name: "Mastra",
    level: "debug"
  }),
  deployer: new VercelDeployer({
    teamId: "team_9rvHPQcsumBPHpsQKRB2YGwc",
    projectName: "mostro-services",
    token: "MBMGCRcyBYZDjbVCoSgmDPGh"
  }),
  telemetry: {
    serviceName: "mostro-services",
    enabled: true,
    export: {
      type: "custom",
      exporter: new OTLPStorageExporter({
        storage: postgresStore,
        logger: createLogger({
          name: "Mastra",
          level: "debug"
        })
      })
    }
  }
  // serverMiddleware: [
  //   {
  //     handler: async (c, next) => {
  //       // Example: Add request logging
  //       console.log("middleware", c);
  //       console.log("mastra", c.mastra);

  //       await next();
  //     }
  //     // This middleware will apply to all routes since no path is specified
  //   }
  // ]
});
