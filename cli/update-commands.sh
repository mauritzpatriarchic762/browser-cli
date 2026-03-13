#!/bin/bash

# Update all command files to use shared client

for file in commands/*.js; do
  if [ "$file" != "commands/index.js" ]; then
    # Replace import
    sed -i '' "s/import { MCPClient } from '..\/lib\/mcp-client.js';/import { getClient } from '..\/lib\/shared-client.js';/g" "$file"
    
    # Replace const client = new MCPClient();
    sed -i '' "s/const client = new MCPClient();/const client = await getClient();/g" "$file"
    
    # Remove finally blocks that close client
    sed -i '' '/} finally {/,/}/d' "$file"
    
    # Fix async function declarations that now need await
    sed -i '' 's/export async function \(.*\)(/export async function \1(/g' "$file"
  fi
done

echo "✅ All command files updated to use shared client"
