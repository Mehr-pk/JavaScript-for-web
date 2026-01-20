import { config } from "../config.js";
import { cache } from "../storage/cache.js";
import { logger } from "../utils/logger.js";

async function fetchUsersFromAPI() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, config.FETCH_TIMEOUT_MS);
  
  try {
    const response = await fetch(config.API_URL, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.users || !Array.isArray(data.users)) {
      throw new Error("Invalid response: users array not found");
    }
    
    return data.users;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === "AbortError") {
      throw new Error(`User fetch failed: Request timeout (${config.FETCH_TIMEOUT_MS}ms)`);
    }
    
    throw new Error(`User fetch failed: ${error.message}`);
  }
}

export async function syncUsers() {
  try {
    logger.info("Syncing users from API...");
    const users = await fetchUsersFromAPI();
    cache.saveCache(users);
    logger.info("Users synced and cached");
    return users;
  } catch (error) {
    logger.error(`Sync failed: ${error.message}`);
    throw error;
  }
}

export async function getUsers() {
  try {
    const cacheData = cache.readCache();
    
    if (cacheData && cache.isCacheValid(cacheData.savedAt)) {
      logger.info("Loading users from cache");
      return cacheData.users;
    }
    
    logger.info("Cache expired or not found, fetching from API");
    return await syncUsers();
  } catch (error) {
    logger.error(`Failed to get users: ${error.message}`);
    throw error;
  }
}
