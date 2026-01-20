import { getUsers, syncUsers } from "../services/userService.js";
import { cache } from "../storage/cache.js";
import { logger } from "../utils/logger.js";
import { debounce } from "../utils/debounce.js";

const debouncedSearch = debounce(performSearch, 300);

async function syncCommand() {
  try {
    const users = await syncUsers();
    logger.info("Synced successfully");
    logger.table(users.map(user => ({
      id: user.id,
      firstName: user.firstName,
      email: user.email
    })));
  } catch (error) {
    logger.error(error.message);
  }
}

async function listCommand() {
  try {
    const users = await getUsers();
    logger.table(users.map(user => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    })));
  } catch (error) {
    logger.error(error.message);
  }
}

async function performSearch(keyword) {
  try {
    const users = await getUsers();
    const results = users.filter(user => {
      const firstName = user.firstName.toLowerCase();
      const lastName = user.lastName.toLowerCase();
      const email = user.email.toLowerCase();
      const searchTerm = keyword.toLowerCase();
      
      return firstName.includes(searchTerm) || 
             lastName.includes(searchTerm) || 
             email.includes(searchTerm);
    });
    
    if (results.length === 0) {
      logger.warn(`No users found matching "${keyword}"`);
      return;
    }
    
    logger.info(`Found ${results.length} user(s)`);
    logger.table(results.map(user => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    })));
  } catch (error) {
    logger.error(error.message);
  }
}

async function searchCommand(keyword) {
  if (!keyword) {
    logger.warn("Please provide a search keyword");
    return;
  }
  
  debouncedSearch(keyword);
}

async function clearCacheCommand() {
  try {
    cache.clearCache();
  } catch (error) {
    logger.error(error.message);
  }
}

export const cliRunner = {
  async handleCommand(command, args) {
    switch (command) {
      case "sync":
        await syncCommand();
        break;
      case "list":
        await listCommand();
        break;
      case "search":
        await searchCommand(args[0]);
        break;
      case "clear-cache":
        await clearCacheCommand();
        break;
      default:
        logger.warn(`Unknown command: ${command}`);
        logger.info("Available commands: sync, list, search <keyword>, clear-cache");
    }
  }
};
