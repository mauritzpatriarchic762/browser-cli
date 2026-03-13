import { getClient, closeClient } from '../lib/shared-client.js';
import { extractPageId } from '../lib/parse-response.js';

export async function snapshot(url) {
  try {
    const client = await getClient();
    let pageId;
    
    // If URL provided, navigate to it first
    if (url) {
      console.log(`Taking DOM snapshot of ${url}...`);
      const navResult = await client.callTool('navigate_page', { url });
      pageId = extractPageId(navResult);
      await client.callTool('wait_for', { duration: 1000 });
    } else {
      console.log('Taking DOM snapshot of current page...');
    }
    
    const result = await client.callTool('take_snapshot', {});
    
    console.log('✓ DOM snapshot captured:');
    if (result?.content?.[0]?.text) {
      console.log(result.content[0].text);
    }
    if (pageId) {
      console.log(`Page ID: ${pageId}`);
      return pageId;
    }
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  } finally {
    await closeClient();
  }
}
