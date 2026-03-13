#!/usr/bin/env node

import { MCPClient } from './lib/mcp-client.js';

async function inspectTools() {
  const client = new MCPClient();
  
  try {
    await client.connect();
    
    console.log('🔍 Inspecting MCP Tools...\n');
    
    // List available tools
    const tools = await client.client.listTools();
    
    console.log(`Found ${tools.tools.length} tools:\n`);
    
    // Show all tools
    for (const tool of tools.tools) {
      console.log(`📌 ${tool.name}`);
      console.log(`   Description: ${tool.description}`);
      console.log(`   Input Schema:`);
      console.log(JSON.stringify(tool.inputSchema, null, 2));
      console.log('');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.close();
  }
}

inspectTools();
