function getTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const date = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
}

export const logger = {
  info(message) {
    console.log(`[${getTimestamp()}] INFO: ${message}`);
  },
  
  warn(message) {
    console.warn(`[${getTimestamp()}] WARN: ${message}`);
  },
  
  error(message) {
    console.error(`[${getTimestamp()}] ERROR: ${message}`);
  },
  
  table(data) {
    console.table(data);
  }
};