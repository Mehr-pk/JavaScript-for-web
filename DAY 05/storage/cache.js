import fs from "fs";
import { config } from "../config.js";
import { logger } from "../utils/logger.js";

export const cache = {
  saveCache(users) {
    try {
      const data = {
        users,
        savedAt: Date.now()
      };
      fs.writeFileSync(config.CACHE_FILE_PATH, JSON.stringify(data, null, 2));
      logger.info("Cache saved successfully");
    } catch (error) {
      logger.error(`Failed to save cache: ${error.message}`);
      throw error;
    }
  },
  
  readCache() {
    try {
      if (!fs.existsSync(config.CACHE_FILE_PATH)) {
        logger.warn("Cache file does not exist");
        return null;
      }
      
      const data = fs.readFileSync(config.CACHE_FILE_PATH, "utf-8");
      const parsed = JSON.parse(data);
      return parsed;
    } catch (error) {
      logger.error(`Failed to read cache: ${error.message}`);
      return null;
    }
  },
  
  isCacheValid(savedAt) {
    const cacheAge = Date.now() - savedAt;
    return cacheAge < config.CACHE_EXPIRY_MS;
  },
  
  clearCache() {
    try {
      if (fs.existsSync(config.CACHE_FILE_PATH)) {
        fs.unlinkSync(config.CACHE_FILE_PATH);
        logger.info("Cache cleared successfully");
      } else {
        logger.warn("Cache file does not exist");
      }
    } catch (error) {
      logger.error(`Failed to clear cache: ${error.message}`);
      throw error;
    }
  }
};
