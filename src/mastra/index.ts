import { Mastra } from "@mastra/core";
import { createLogger } from "@mastra/core/logger";
// import { VercelDeployer } from "../deployers/vercel";
import { webSearchAgent, dataAnalysisAgent } from "./agents";
import { PgVector } from "@mastra/pg";
import { researchNetwork } from "./networks";

const pgVector = new PgVector(process.env.DATABASE_URL || "");

export const mastra = new Mastra({
  agents: { webSearchAgent, dataAnalysisAgent },
  vectors: { pgVector },
  networks: { researchNetwork },
  logger: createLogger({
    name: "Mastra",
    level: "info"
  })
  // deployer: new VercelDeployer({
  //   teamId: "team_9rvHPQcsumBPHpsQKRB2YGwc",
  //   projectName: "mastra-services",
  //   token: "MBMGCRcyBYZDjbVCoSgmDPGh"
  // })
});
