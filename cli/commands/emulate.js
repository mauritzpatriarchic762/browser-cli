import { getClient, closeClient } from '../lib/shared-client.js';

export async function emulate(url, device) {
  if (!url || !device) {
    console.error('✗ Error: URL and device are required');
    process.exit(1);
  }

  try {
    const client = await getClient();
    console.log(`Emulating ${device}...`);
    await client.callTool('emulate', { device });
    
    console.log(`Navigating to ${url}...`);
    const result = await client.callTool('navigate_page', { url });
    
    console.log(`✓ Emulating ${device}`);
    if (result?.content?.[0]?.text) {
      console.log(result.content[0].text);
    }
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  } finally {
    await closeClient();
  }
}
