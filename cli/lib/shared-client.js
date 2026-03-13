import { MCPClient } from './mcp-client.js';

// Shared MCP client instance
let sharedClient = null;

export async function getClient() {
  if (!sharedClient) {
    sharedClient = new MCPClient();
    await sharedClient.connect();
  }
  return sharedClient;
}

export async function closeClient() {
  if (sharedClient) {
    await sharedClient.close();
    sharedClient = null;
  }
}
