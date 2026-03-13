import { getClient, closeClient } from '../lib/shared-client.js';

export async function consoleLogs(url) {
  try {
    const client = await getClient();
    
    if (url) {
      console.log(`Capturing console logs from ${url}...`);
      await client.callTool('navigate_page', { url });
      await client.callTool('wait_for', { duration: 2000 });
    } else {
      console.log('Capturing console logs from current page...');
    }
    
    const result = await client.callTool('list_console_messages', {});
    
    console.log('✓ Console logs:');
    if (result?.content?.[0]?.text) {
      console.log(result.content[0].text);
    } else {
      console.log('No console messages found');
    }
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  } finally {
    await closeClient();
  }
}
