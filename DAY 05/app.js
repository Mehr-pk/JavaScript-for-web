import { cliRunner } from "./tasks/cliRunner.js";
import { logger } from "./utils/logger.js";

async function main() {
  try {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
      logger.warn("No command provided");
      logger.info("Available commands: sync, list, search <keyword>, clear-cache");
      return;
    }
    
    const command = args[0];
    const commandArgs = args.slice(1);
    
    await cliRunner.handleCommand(command, commandArgs);
  } catch (error) {
    logger.error(error.message);
    process.exit(1);
  }
}

main();
