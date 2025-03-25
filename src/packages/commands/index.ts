#! /usr/bin/env node
import { Command } from "commander";
import { createLogger } from "@mastra/core/logger";

export const logger = createLogger({
  name: "Mastra CLI",
  level: "debug"
});

import { dev } from "./dev/dev";

const program = new Command();

program
  .command("dev")
  .description("Start mastra server")
  .option("-d, --dir <dir>", "Path to your mastra folder")
  .option("-r, --root <root>", "Path to your root folder")
  .option(
    "-t, --tools <toolsDirs>",
    "Comma-separated list of paths to tool files to include"
  )
  .option(
    "-p, --port <port>",
    "Port number for the development server (defaults to 4111)"
  )
  .action(args => {
    console.log("local package dev");

    dev({
      port: args?.port ? parseInt(args.port) : 4111,
      dir: args?.dir,
      root: args?.root,
      tools: args?.tools ? args.tools.split(",") : []
    }).catch(err => {
      logger.error(err.message);
    });
  });
